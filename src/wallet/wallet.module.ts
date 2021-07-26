import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
