import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { Transaction } from 'src/entities/Transaction';
import { Token } from 'src/entities/Token';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Account, Transaction])],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
