import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { OutTransaction } from 'src/entities/OutTransaction';
import { Token } from 'src/entities/Token';
import { GasLimitModule } from '../gas-limit/gas-limit.module';
import { ClearingService } from './clearing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Account, OutTransaction]),
    GasLimitModule
  ],
  providers: [ClearingService],
  exports: [ClearingService]
})
export class ClearingMoudle {}
