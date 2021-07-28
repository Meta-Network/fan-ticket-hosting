import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BigNumber } from 'ethers';
import { currentProvider } from 'src/constant/providers';
@Injectable()
export class GasLimitService {
    latestSafeGasLimit = BigNumber.from(10000000);

    constructor() {
        this.updateLatestGasLimit()
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async updateLatestGasLimit(): Promise<void> {
        const block = await currentProvider.getBlock('latest');
        // set 75% of current gaslimit as safe line
        this.latestSafeGasLimit = block.gasLimit.div(100).mul(75);
    }
}
