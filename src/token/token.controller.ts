import { Body, Controller, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BigNumber } from 'ethers';
import { Account } from 'src/entities/Account';
import { Token } from 'src/entities/Token';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/CreateTokenDto';
import { MintDto, TransferDto } from './dto/TokenTransactionDto';
import { TokenService } from './token.service';

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

  @Post(':tokenId/transfer')
  async transferToken(
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body() transferDto: TransferDto,
  ): Promise<any> {
    const token = await this.tokenRepo.findOne(tokenId);
    if (!token) {
      throw new NotFoundException("No Such Token exist.")
    }
    // @todo: remove this when go to prod
    const from = await this.accRepo.findOne(transferDto.from);

    // error will be throwed if transferDto.value is wrong.
    const transferValue = this.service.parseBigNumber(transferDto.value)
    
    // @todo: try to estimateGas, not inserting if failed

    await this.service.transfer(
      token,
      from,
      transferDto.to,
      transferValue,
      transferDto.password
    );
    return { msg: 'ok' };
  }

  @Post(':tokenId/mint')
  async mintToken(
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body() body: MintDto,
  ): Promise<any> {
    const token = await this.tokenRepo.findOne(tokenId, { relations: ['owner'] });
    if (!token) {
      throw new NotFoundException("No Such Token exist.")
    }
    console.info('token', token)
    // @todo: check request user is owner or not in prod
    const from = token.owner;

    // error will be throwed if transferDto.value is wrong.
    const transferValue = this.service.parseBigNumber(body.value)
    // @todo: try to estimateGas, not inserting if failed
    await this.service.mint(
      token,
      from,
      body.to,
      transferValue,
      body.password
    );
    return { msg: 'ok' };
  }

  @Post(':tokenId/approve')
  async approveToken(
    @Param('tokenId', ParseIntPipe) tokenId: number,
    @Body() body: MintDto,
  ): Promise<any> {
    const token = await this.tokenRepo.findOne(tokenId, { relations: ['owner'] });
    if (!token) {
      throw new NotFoundException("No Such Token exist.")
    }
    // @todo: check request user is owner or not in prod
    const from = token.owner;
    // error will be throwed if transferDto.value is wrong.
    const transferValue = this.service.parseBigNumber(body.value)

    await this.service.approve(
      token,
      from,
      body.to,
      transferValue,
      body.password
    );
    return { msg: 'ok' };
  }

}
