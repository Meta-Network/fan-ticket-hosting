import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { currentContracts } from 'src/constant/contracts';
import { currentProvider } from 'src/constant/providers';
import { OutTransaction, TransactionType } from 'src/entities/OutTransaction';
import { MintOrder, TransferOrder } from 'src/token/typing';
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
        this.clearingHouse = FanTicketClearingHouse__factory.connect(
            currentContracts.ClearingHouse,
            currentProvider,
        );
        this.logger = new Logger('TokenCronService')
        const privateKey = configService.get<string>('privateKeys.clearingOperator');
        this.#clearingOperator = new Wallet(privateKey, currentProvider)
        this.logger.verbose(`Clearing Operator Wallet is ${this.#clearingOperator.address}`)
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async clearingTransactions(): Promise<void> {
        // a software lock, avoid race condition
        if (this.lock) {
            this.logger.verbose('Lock is enabled, wait for unlock')
            return;
        }
        this.lock = true;
        const txs = await this.txRepo.find({
            where: { status: TransactionStatus.PENDING },
        });

        this.logger.verbose(`Clearing Txs: ${txs}`);


        // const orders: Array<TransferOrder | MintOrder> = txs.map((tx) => {
        //     return { ...tx, isMint: tx.type === TransactionType.MINT }
        // });
        // this.clearingHouse.estimateGas.handleTransferOrders();

        // clearing mess
        this.lock = false;
    }

}
