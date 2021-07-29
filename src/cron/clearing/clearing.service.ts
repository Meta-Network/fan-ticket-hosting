import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { currentContracts } from 'src/constant/contracts';
import { currentProvider } from 'src/constant/providers';
import { OutTransaction, TransactionType } from 'src/entities/OutTransaction';
import { ApproveOrder, MintOrder, TransferOrder, TxType } from 'src/token/typing';
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
        private readonly configService: ConfigService,
        private readonly gasService: GasLimitService,        
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

    @Cron(CronExpression.EVERY_MINUTE)
    async clearingTransactions(): Promise<void> {
        // a software lock, avoid race condition
        if (this.lock) {
            this.logger.verbose('Lock is enabled, wait for unlock')
            return;
        }

        const safeMaxTxQty = Number(this.gasService.latestSafeGasLimit.div("600000").toBigInt())

        const pendingTxs = await this.txRepo.find({
            where: { status: TransactionStatus.PENDING },
            take: safeMaxTxQty,
            relations: ['token', 'from']
        });
        if (pendingTxs.length === 0) return; // skip
        
        // handling txs
        this.lock = true;

        this.logger.verbose(`Clearing Txs: ${pendingTxs.map(t => t.id).join(', ')}`);


        const orders: Array<TransferOrder | MintOrder | ApproveOrder> = pendingTxs.map((tx) => {
            const typeMapping: Record<TransactionType, TxType> = {
                [TransactionType.MINT]: TxType.Mint,
                [TransactionType.APPROVE]: TxType.Permit,
                [TransactionType.TRANSFER]: TxType.Transfer,
            }
            return { 
                token: tx.token.address,
                from: tx.from.address,
                to: tx.to,
                value: tx.value,
                _type: typeMapping[tx.type],
                deadline: tx.deadline,
                v: tx.v,
                r: tx.r,
                s: tx.s,
            }
        });
        const tx = await this.clearingHouse.handleTransferOrders(orders);

        await this.txRepo.update(pendingTxs.map(t => t.id), {
            txHash: tx.hash,
            status: TransactionStatus.SENDING
        })
        // clearing mess
        this.lock = false;
    }

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
}
