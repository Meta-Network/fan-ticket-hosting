import { Module } from '@nestjs/common';
import { InterchainService } from './interchain.service';

@Module({
  providers: [InterchainService]
})
export class InterchainModule {}
