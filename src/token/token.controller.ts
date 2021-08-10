import { Body, Controller, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { BigNumber } from 'ethers';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserId } from 'src/decorators/user.decorator';
import { Account } from 'src/entities/Account';
import { Token } from 'src/entities/Token';
import { CheckTransactionPipe } from 'src/pipes/transactionDto.pipe';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/CreateTokenDto';
import { TransactionDto } from './dto/TokenTransactionDto';
import { TokenService } from './token.service';

enum TransactionType {
  Transfer = 'transfer',
  Approve = 'approve',
  Mint = 'mint'
}

@Controller('token')
export class TokenController {
  constructor(
    @InjectRepository(Account)
    private readonly accRepo: Repository<Account>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly service: TokenService,
  ) {}


  @UseGuards(JwtAuthGuard)
  @Post('')
  async createToken(
    @CurrentUserId() ownerId: number,
    @Body() createTokenDto: CreateTokenDto,
  ): Promise<any> {
    const owner = await this.accRepo.findOne(ownerId);
    // const initialSupply = this.service.parseBigNumber(createTokenDto.initialSupply);
    await this.service.create(
      createTokenDto.name,
      createTokenDto.symbol,
      owner,
      BigNumber.from(createTokenDto.initialSupply),
    );
    return { msg: 'ok' };
  }

  @ApiQuery({ name: 'type', enum: TransactionType })
  @UseGuards(JwtAuthGuard)
  @Post(':tokenId/transaction/')
  async newTransaction(
    @Query('type') type: TransactionType,
    @CurrentUserId() ownerId: number,
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body(CheckTransactionPipe) transferDto: TransactionDto,
  ): Promise<any> {
    const token = await this.tokenRepo.findOne(tokenId);
    if (!token) {
      throw new NotFoundException("No Such Token exist.")
    }
    const from = await this.accRepo.findOne(ownerId);

    await this.service[type](
      token,
      from,
      transferDto.to,
      transferDto.value as BigNumber,
      transferDto.password
    )
    
    return { msg: 'ok' };
  }

}
