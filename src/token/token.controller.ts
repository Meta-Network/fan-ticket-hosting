import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BigNumber } from 'ethers';
import { Account } from 'src/entities/Account';
import { Token } from 'src/entities/Token';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/CreateTokenDto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(
    @InjectRepository(Account)
    private readonly accRepo: Repository<Account>,
    private readonly service: TokenService,
  ) {}
  @Post(':ownerId')
  async createToken(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Body() createTokenDto: CreateTokenDto,
  ) {
    const owner = await this.accRepo.findOne(ownerId);
    const initialSupply = BigNumber.from(createTokenDto.initialSupply);
    await this.service.create(
      createTokenDto.name,
      createTokenDto.symbol,
      owner,
      initialSupply,
    );
    return { msg: 'ok' };
  }

  @Post('')
  async batchIssue() {
    await this.service.handleTokenIssueRequest();
    return { msg: 'ok' };
  }
}
