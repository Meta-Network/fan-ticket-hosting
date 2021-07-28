import { Module } from '@nestjs/common';
import { TokenModule as TokenCronModule } from './token/token.module';
import { GasLimitModule } from './gas-limit/gas-limit.module';
import { ClearingService } from './clearing/clearing.service';

@Module({
  imports: [TokenCronModule, GasLimitModule],
  providers: [ClearingService],
})
export class CronModule {}
