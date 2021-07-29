import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { OutTransaction } from 'src/entities/OutTransaction';
import { Token } from 'src/entities/Token';
import { ClearingHouseModule } from 'src/clearing-house/clearing-house.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Account, OutTransaction]),
    ClearingHouseModule,
  ],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
