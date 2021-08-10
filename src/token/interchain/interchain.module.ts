import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { InterChainToken } from 'src/entities/InterChainToken';
import { InterChainTransaction } from 'src/entities/InterChainTransaction';
import { InterchainService } from './interchain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterChainToken, Account, InterChainTransaction]),
  ],
  providers: [InterchainService]
})
export class InterchainModule {}
