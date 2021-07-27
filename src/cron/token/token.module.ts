import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities/Account';
import { OutTransaction } from '../../entities/OutTransaction';
import { Token } from '../../entities/Token';
import { GasLimitModule } from '../gas-limit/gas-limit.module';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Account, OutTransaction]),
    GasLimitModule
  ],
  providers: [TokenService],
})
export class TokenModule {}
