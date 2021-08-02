import { BadRequestException, Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserId } from 'src/decorators/user.decorator';
import { CreateWalletDto } from './dto/CreateWallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private service: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWallet(
    @CurrentUserId() userId: number,
    @Body() body: CreateWalletDto
  ): Promise<any> {
    if (!body) throw new BadRequestException("Body not exist")
    if (!body.password) throw new BadRequestException("Password should not empty")
    await this.service.createWalletFor(userId, body.password);
    return { message: 'ok' };
  }
}
