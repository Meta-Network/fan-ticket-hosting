import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entities/Account';
import { OutTransaction } from '../../entities/OutTransaction';
import { Token } from '../../entities/Token';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Account, OutTransaction])],
  providers: [TokenService],
})
export class TokenModule {}
