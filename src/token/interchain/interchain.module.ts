import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { InterChainToken } from 'src/entities/InterChainToken';
import { InterChainTransaction } from 'src/entities/InterChainTransaction';
import { InterchainService } from './interchain.service';
import { InterchainController } from './interchain.controller';
import { Token } from 'src/entities/Token';
import { OutTransaction } from 'src/entities/OutTransaction';
import { InterChainInTransaction } from 'src/entities/InterChainInTransaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterChainToken, Token, InterChainInTransaction, OutTransaction, Account, InterChainTransaction]),
  ],
  providers: [InterchainService],
  controllers: [InterchainController]
})
export class InterchainModule {}
