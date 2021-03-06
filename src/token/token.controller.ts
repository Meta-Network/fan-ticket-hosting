import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { BigNumber } from 'ethers';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { currentChainId } from 'src/constant';
import { CurrentUserId } from 'src/decorators/user.decorator';
import { Account } from 'src/entities/Account';
import { Token } from 'src/entities/Token';
import { CheckTransactionPipe } from 'src/pipes/transactionDto.pipe';
import { StandardTokenList, StandardTokenProfile } from 'src/types/token.type';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/CreateTokenDto';
import { TransactionDto } from './dto/TokenTransactionDto';
import { TokenService } from './token.service';

enum TransactionType {
  Transfer = 'transfer',
  Approve = 'approve',
  Mint = 'mint'
}

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(
    @InjectRepository(Account)
    private readonly accRepo: Repository<Account>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly service: TokenService,
  ) {}

  /**
   * `getTokenList`
   * return a standard token list which comply TokenList's spec
   * for more checkout: tokenlists.org
   * @returns a list of tokens with TokenList standard
   */
  @Get('')
  async getTokenList(): Promise<StandardTokenList> {
    const tokensList = await this.tokenRepo.find();

    const tokens : StandardTokenProfile[] = tokensList.map(({ name, symbol, address, ...t }) => {
      return { chainId: currentChainId, name, symbol, decimals: 18, address, logoURI: '' }
    })
    return {
      name: 'Meta Network FanTicket List',
      timestamp: new Date().toISOString(),
      version: {
        major: 1,
        minor: 1,
        patch: 0
      },
      logoURI: "",
      keywords: ['meta network', 'fanticket'],
      tokens
    }
  }


  /**
   * 
   * @param ownerId the owner's id, determined by JWT Token
   * @param createTokenDto the data to create token
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createToken(
    @CurrentUserId() ownerId: number,
    @Body() createTokenDto: CreateTokenDto,
  ): Promise<any> {
    // @todo: return type
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

  /**
   * 
   * @param type the transaction type, `transfer` `approve` and `mint` are available
   * @param ownerId the user who is acting this transaction, it only depends on the OAuth token from Meta Space
   * @param tokenId the id of token which is using in a transaction
   * @param transferDto data of a transaction
   * @returns 
   */
  @ApiQuery({ name: 'type', enum: TransactionType })
  @UseGuards(JwtAuthGuard)
  @Post(':tokenId/transaction/')
  async newTransaction(
    @Query('type') type: TransactionType,
    @CurrentUserId() ownerId: number,
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body(CheckTransactionPipe) transferDto: TransactionDto,
  ): Promise<any> {
    // @todo: typing on returns
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
