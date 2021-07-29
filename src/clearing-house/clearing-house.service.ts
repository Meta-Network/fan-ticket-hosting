import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { currentContracts } from 'src/constant/contracts';
import { currentProvider } from 'src/constant/providers';
import { GasLimitService } from 'src/cron/gas-limit/gas-limit.service';
import { OutTransaction, TransactionType } from 'src/entities/OutTransaction';
import { ApproveOrder, MintOrder, TransferOrder, TxType } from 'src/token/typing';
import { TransactionStatus } from 'src/types';
import { FanTicketClearingHouse, FanTicketClearingHouse__factory } from 'src/types/contracts';
import { Repository } from 'typeorm';

@Injectable()
export class ClearingHouseService {
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

    transactionParser(transactions: OutTransaction[]): Array<TransferOrder | MintOrder | ApproveOrder> {
        return transactions.map((tx) => {
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
    }

    /**
     * estimate will provided transaction success or not
     * based on the current queue of pending tx
     * if estimated revert, then a Error will be throwned
     * @param transaction The transcation object
     */
    async estimateTransactionStatus(transaction: OutTransaction): Promise<void> {
        const relatedPendingTxs = await this.txRepo.find({
            where: {
            // only this token
            token: { id: transaction.token.id },
            status: TransactionStatus.PENDING
          },
        })
    
        const orders = this.transactionParser(relatedPendingTxs)
        return new Promise<void>((resolve, reject) => {
            this.clearingHouse.callStatic.handleTransferOrders(orders).then(() => resolve()).catch((err) => {
                reject(err)
            })
        })
    }

}
