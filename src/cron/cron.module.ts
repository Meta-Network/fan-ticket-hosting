import { Module } from '@nestjs/common';
import { TokenModule as TokenCronModule } from './token/token.module';
import { GasLimitModule } from './gas-limit/gas-limit.module';
import { ClearingMoudle } from './clearing/clearing.module';

@Module({
  imports: [TokenCronModule, GasLimitModule, ClearingMoudle],
})
export class CronModule {}
