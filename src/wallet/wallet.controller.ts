import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private service: WalletService) {}

  @Post(':id')
  async createWallet(@Param('id', ParseIntPipe) id: number) {
    const wallet = await this.service.createWalletFor(id, 'foobar');
    return { message: 'ok' };
  }
}
