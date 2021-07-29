import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GasLimitModule } from 'src/cron/gas-limit/gas-limit.module';
import { Account } from 'src/entities/Account';
import { OutTransaction } from 'src/entities/OutTransaction';
import { Token } from 'src/entities/Token';
import { ClearingHouseService } from './clearing-house.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Account, OutTransaction]),
    GasLimitModule
  ],
  providers: [ClearingHouseService],
  exports: [ClearingHouseService]
})
export class ClearingHouseModule {}
