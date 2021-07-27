import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private service: WalletService) {}

  @Post(':id/:password')
  async createWallet(
    @Param('id', ParseIntPipe) id: number,
    @Param('password') password: string,
  ) {
    const wallet = await this.service.createWalletFor(id, password);
    return { message: 'ok' };
  }
}
