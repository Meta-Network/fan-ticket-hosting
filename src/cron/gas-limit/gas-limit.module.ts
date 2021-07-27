import { Module } from '@nestjs/common';
import { GasLimitService } from './gas-limit.service';

@Module({
  providers: [GasLimitService],
  exports: [GasLimitService]
})
export class GasLimitModule {}
