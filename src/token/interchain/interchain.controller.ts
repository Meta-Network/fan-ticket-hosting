import { Controller, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserId } from 'src/decorators/user.decorator';
import { InterChainToken } from 'src/entities/InterChainToken';
import { Token } from 'src/entities/Token';
import { Repository } from 'typeorm';
import { InterchainService } from './interchain.service';

@Controller('token/interchain')
export class InterchainController {

    constructor(private readonly service: InterchainService,
        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,) {}

    @Post('/:tokenId/:chainId')
    @UseGuards(JwtAuthGuard)
    async requestInterChainTokenCreationPermit(
        @CurrentUserId() ownerId: number,
        @Param('tokenId', ParseIntPipe) tokenId: number,
        @Param('chainId', ParseIntPipe) chainId: number,
    ): Promise<any> {
        const token = await this.tokenRepo.findOne(tokenId);
        if (!token) {
          throw new NotFoundException("No Such Token exist.")
        }
        const permit = await this.service.requestInterChainCreationPermit(token, chainId)
        return { permit }
    }
}
