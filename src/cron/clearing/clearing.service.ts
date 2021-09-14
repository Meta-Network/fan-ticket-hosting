import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { ClearingHouseService } from 'src/clearing-house/clearing-house.service';
import { currentContracts } from 'src/constant/contracts';
import { currentProvider } from 'src/constant/providers';
import { InterChainInTransaction } from 'src/entities/InterChainInTransaction';
import { OutTransaction } from 'src/entities/OutTransaction';
import { TransactionOrder, TxType } from 'src/token/typing';
import { TransactionStatus } from 'src/types';
import { FanTicketClearingHouse, FanTicketClearingHouse__factory } from 'src/types/contracts';
import { Repository } from 'typeorm';
import { GasLimitService } from '../gas-limit/gas-limit.service';

@Injectable()
export class ClearingService {
    #clearingOperator: Wallet;
    logger: Logger;
    clearingHouse: FanTicketClearingHouse;
    lock = false;

    constructor(
        @InjectRepository(OutTransaction)
        private readonly txRepo: Repository<OutTransaction>,
        @InjectRepository(InterChainInTransaction)
        private readonly icWithdrawRepo: Repository<InterChainInTransaction>,
        private readonly configService: ConfigService,
        private readonly gasService: GasLimitService,        
        private readonly chService: ClearingHouseService,        
    ) {

        this.logger = new Logger('TokenCronService')
        const privateKey = configService.get<string>('privateKeys.clearingOperator');
        this.#clearingOperator = new Wallet(privateKey, currentProvider)
    
        this.logger.verbose(`Clearing Operator Wallet is ${this.#clearingOperator.address}`)
        this.clearingHouse = FanTicketClearingHouse__factory.connect(
            currentContracts.ClearingHouse,
            this.#clearingOperator,
        );
    }

    /**
     * find and convert the transactions data of parkijg withdraw(parking => user original token account)
     * in order for `clearingTransactions` to handle
     * @returns pending transactions
     */
    async findAndParseICTokenWithdraw(): Promise<{parsedOrder: TransactionOrder[], ids: number[]}> {
        const pendingWithdrawl = await this.icWithdrawRepo.find({
            where: {status: TransactionStatus.PENDING,},
            relations: ['token']
        });
        const parsedOrder = pendingWithdrawl.map(({ to, r, s, v, deadline, value, token }) => {
            return {
                from: currentContracts.Parking,
                to,
                value,
                _type: TxType.InterChainWithdraw,
                token: token.address,
                r, s, v, deadline
            }
        })
        return { parsedOrder, ids: pendingWithdrawl.map(d => d.id) }
    }

    /**
     * clearing any transaction happened in `currentProvider`
     * including approve / transfer 
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async clearingTransactions(): Promise<void> {
        // a software lock, avoid race condition
        if (this.lock) {
            this.logger.verbose('Lock is enabled, wait for unlock')
            return;
        }

        const safeMaxTxQty = Number(this.gasService.latestSafeGasLimit.div("600000").toBigInt())

        const pendingTokenTxs = await this.txRepo.find({
            where: { status: TransactionStatus.PENDING },
            take: safeMaxTxQty,
            relations: ['token', 'from']
        });
        // clear the ic token withdraw txs
        const {parsedOrder, ids: withdrawIds} = await this.findAndParseICTokenWithdraw()
        const pendingTxs = [...this.chService.transactionParser(pendingTokenTxs), ...parsedOrder]
        if (pendingTxs.length === 0) return; // skip
        
        // handling txs
        this.lock = true;

        this.logger.verbose(`Clearing Txs`);


        // const orders = this.chService.transactionParser(pendingTxs)
        const tx = await this.clearingHouse.handleTransferOrders(pendingTxs);

        // marking these txs as `SENDING`
        if (pendingTokenTxs.length > 0) 
            await this.txRepo.update(pendingTokenTxs.map(t => t.id), {
                txHash: tx.hash,
                status: TransactionStatus.SENDING
            })

        if (withdrawIds.length > 0)
            await this.icWithdrawRepo.update(withdrawIds, {
                status: TransactionStatus.SENDING,
                txHash: tx.hash
            })
        
        // clearing mess
        this.lock = false;
    }

    /**
     * check previous `SENDING` txs are success or not.
     */
    @Cron(CronExpression.EVERY_30_SECONDS)
    async checkSentIssuing(): Promise<void> {
        const sendingTxs = await this.txRepo.find({
            where: { status: TransactionStatus.SENDING },
        })
        if (sendingTxs.length === 0)
            return // skip then
        
        const relatedTxHashes = [...new Set(sendingTxs.map(t => t.txHash))];
        const receipts = await Promise.all(relatedTxHashes.map(hash => currentProvider.getTransactionReceipt(hash)))
        // txReceipt should not be null, and confirmations should >= 3
        const confirmedTxs = receipts.filter(r => Boolean(r) && r.confirmations >= 3)
        const confirmedTxHashes = confirmedTxs.map(r => r.transactionHash)
        const successTxs = sendingTxs.filter(t => confirmedTxHashes.includes(t.txHash))
        this.logger.verbose(`Success Tx Ids: ${successTxs.map(t => t.id)}`)
        await this.txRepo.update(successTxs.map(t => t.id), {
            status: TransactionStatus.SUCCESS,
            // clear the signature as txs are broadcasted
            r: '', s: '', v: 0
        })
    }

    /**
     * check previous `SENDING` ic withdraw(ic token burnt, parking => user's origin token wallet) txs are success or not.
     */
    @Cron(CronExpression.EVERY_30_SECONDS)
    async checkWithdrawFromParkingTx(): Promise<void> {
        const sendingTxs = await this.icWithdrawRepo.find({
            where: { status: TransactionStatus.SENDING },
        })
        if (sendingTxs.length === 0)
            return // skip then
        
        const relatedTxHashes = [...new Set(sendingTxs.map(t => t.txHash))];
        const receipts = await Promise.all(relatedTxHashes.map(hash => currentProvider.getTransactionReceipt(hash)))
        // txReceipt should not be null, and confirmations should >= 3
        const confirmedTxs = receipts.filter(r => Boolean(r) && r.confirmations >= 3)
        const confirmedTxHashes = confirmedTxs.map(r => r.transactionHash)
        const successTxs = sendingTxs.filter(t => confirmedTxHashes.includes(t.txHash))
        this.logger.verbose(`Success Tx Ids: ${successTxs.map(t => t.id)}`)
        await this.icWithdrawRepo.update(successTxs.map(t => t.id), {
            status: TransactionStatus.SUCCESS,
            // clear the signature as txs are broadcasted
            r: '', s: '', v: 0
        })
    }
}
