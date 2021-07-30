import { Body, Controller, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { BigNumber } from 'ethers';
import { Account } from 'src/entities/Account';
import { Token } from 'src/entities/Token';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/CreateTokenDto';
import { MintDto, TransactionDto, TransferDto } from './dto/TokenTransactionDto';
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
  @Post(':ownerId')
  async createToken(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Body() createTokenDto: CreateTokenDto,
  ): Promise<any> {
    const owner = await this.accRepo.findOne(ownerId);
    const initialSupply = this.service.parseBigNumber(createTokenDto.initialSupply);
    await this.service.create(
      createTokenDto.name,
      createTokenDto.symbol,
      owner,
      initialSupply,
    );
    return { msg: 'ok' };
  }

  @ApiQuery({ name: 'type', enum: TransactionType })
  @ApiQuery({ name: 'tmpUserId', type: 'number' })
  @Post(':tokenId/transaction/')
  async newTransaction(
    @Query('type') type: TransactionType,
    // @todo: remove `tmpUserId` when go to prod
    @Query('tmpUserId', ParseIntPipe) tmpUserId: number,
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body() transferDto: TransactionDto,
  ): Promise<any> {
    const token = await this.tokenRepo.findOne(tokenId);
    if (!token) {
      throw new NotFoundException("No Such Token exist.")
    }
    // @todo: remove this when go to prod
    const from = await this.accRepo.findOne(tmpUserId);

    // error will be throwed if transferDto.value is wrong.
    const transferValue = this.service.parseBigNumber(transferDto.value)
    const checksumedToAddress = this.service.getChecksumedAddress(transferDto.to);

    await this.service[type](
      token,
      from,
      checksumedToAddress,
      transferValue,
      transferDto.password
    )
    
    return { msg: 'ok' };
  }

}
