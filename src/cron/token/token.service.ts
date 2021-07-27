import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { currentContracts, currentMulticall } from 'src/constant/contracts';
import { currentProvider } from 'src/constant/providers';
import { Token } from 'src/entities/Token';
import { TransactionStatus } from 'src/types';
import { FanTicketFactory, FanTicketFactory__factory } from 'src/types/contracts';
import { Multicall__factory } from 'src/types/contracts/MulticallFactory';
import { Repository, In } from 'typeorm';
import { GasLimitService } from '../gas-limit/gas-limit.service';

@Injectable()
export class TokenService {
    #operatorWallet: Wallet;
    logger: Logger;
    factoryContract: FanTicketFactory;

    constructor(
        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,
        private readonly configService: ConfigService,
        private readonly gasService: GasLimitService,        
    ) {
        this.factoryContract = FanTicketFactory__factory.connect(
            currentContracts.Factory,
            currentProvider,
        );
        this.logger = new Logger('TokenCronService')
        const privateKey = configService.get<string>('operatorWallet.privateKey');
        this.#operatorWallet = new Wallet(privateKey, currentProvider)
        this.logger.verbose(`Operator Wallet is ${this.#operatorWallet.address}`)
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleTokenIssueRequest(): Promise<void> {
        let tokensNeedToDeploy = await this.tokenRepo.find({
            where: { status: TransactionStatus.PENDING },
            relations: [ 'owner' ]
        })

        if (tokensNeedToDeploy.length === 0)
            return // skip then
        
        const approximateMaxTokenQtyInTx = this.gasService.latestSafeGasLimit.div("2000000").toBigInt()
        this.logger.verbose(`Estimated Max Qty for token creation: ${approximateMaxTokenQtyInTx}`)
        if (tokensNeedToDeploy.length > approximateMaxTokenQtyInTx) {
            this.logger.verbose(`slicing tokensNeedToDeploy to len(${Number(approximateMaxTokenQtyInTx)})`)
            tokensNeedToDeploy = tokensNeedToDeploy.slice(0, Number(approximateMaxTokenQtyInTx));
        }
        const notPendingTokens = tokensNeedToDeploy.filter(
            t => t.status !== TransactionStatus.PENDING,
        );
        if (notPendingTokens.length > 0) {
            this.logger.verbose(
                `Not Pending Token Ids: ${notPendingTokens.map(t => t.id).join(', ')}`,
            );
            throw new Error('handleTokenIssueRequest only receives PENDING tokens. ');
        }

        const calls: Array<{
            target: string;
            callData: string;
            }> = tokensNeedToDeploy.map(t => {
            const callData = this.factoryContract.interface.encodeFunctionData('newAPeggedToken', [
                t.name,
                t.symbol,
                t.owner.address,
                t.totalSupply,
                t.id,
                t.v,
                t.r,
                t.s,
            ]);
            return { target: this.factoryContract.address, callData }
        })
        const multicall = Multicall__factory.connect(currentMulticall, this.#operatorWallet);
        // try with call static to see is there anything wrong.
        const estimatedGas = await multicall.estimateGas.aggregate(calls);
        this.logger.verbose(`Estimated Gas for deploying ${calls.length} token(s): ${estimatedGas.toString()}`)
        // 1 blockchain call, that includes all these creations call
        const tx = await multicall.aggregate(calls);
        const hash = tx.hash
        const deployed = tokensNeedToDeploy.map(t => {
            return { ...t, txHash: hash, status: TransactionStatus.SENDING }
        })
        
        // update their status to `TransactionStatus.SENDING` with TxHash
        await this.tokenRepo.update({ id: In(deployed.map(t => t.id)) }, {
            txHash: hash, status: TransactionStatus.SENDING
        });
  }

  @Cron(CronExpression.EVERY_MINUTE)
    async checkSentIssuing(): Promise<void> {
        const sendingTokens = await this.tokenRepo.find({
            where: { status: TransactionStatus.SENDING },
            relations: [ 'owner' ]
        })
        if (sendingTokens.length === 0)
            return // skip then
        
        const relatedTxHashes = sendingTokens.map(t => t.txHash);
        const shaked = [...new Set(relatedTxHashes)];
        const receipts = await Promise.all(shaked.map(hash => this.#operatorWallet.provider.getTransactionReceipt(hash)))
        // txReceipt should not be null, and confirmations should >= 3
        const successTxs = receipts.filter(r => Boolean(r) && r.confirmations >= 3)
        const successTxHashes = successTxs.map(r => r.transactionHash)
        const successTokens = sendingTokens.filter(t => successTxHashes.includes(t.txHash))
        this.logger.verbose(`Success Token Ids: ${successTokens.map(t => t.id)}`)
        await this.tokenRepo.update(successTokens.map(t => t.id), {
            status: TransactionStatus.SUCCESS,
            // clear the signature as token are issued
            r: '', s: '', v: 0
        })
    }
}
