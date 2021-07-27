import { Module } from '@nestjs/common';
import { TokenModule as TokenCronModule } from './token/token.module';
import { GasLimitModule } from './gas-limit/gas-limit.module';

@Module({
  imports: [TokenCronModule, GasLimitModule],
})
export class CronModule {}
