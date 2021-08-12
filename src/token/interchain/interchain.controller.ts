import { BadRequestException, ConflictException, Get } from '@nestjs/common';
import { Controller, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChainId } from 'src/constant';
import { CurrentUserId } from 'src/decorators/user.decorator';
import { Token } from 'src/entities/Token';
import { ParseChainIdPipe } from 'src/pipes/ParseChainId.pipe';
import { Repository } from 'typeorm';
import { InterchainService } from './interchain.service';

@Controller('token/interchain')
export class InterchainController {

    constructor(private readonly service: InterchainService,
        @InjectRepository(Token)
        private readonly originalTokenRepo: Repository<Token>,
    ) {}

    @Get('/:tokenId')
    async findInterChained(
        @Param('tokenId', ParseIntPipe) tokenId: number,
    ): Promise<any> {
        const token = await this.originalTokenRepo.findOne(tokenId, {
            relations: ['interchainTokens']
        });
        if (!token) {
            throw new NotFoundException("No Such Token exist.")
        }

        return { token, interchained: token.interchainTokens }
    }

    @Get('/:tokenId/:chainId')
    async findInterChainTokenByTokenId(
        @Param('tokenId', ParseIntPipe) tokenId: number,
        @Param('chainId', ParseChainIdPipe) chainId: ChainId,
    ): Promise<any> {
        const token = await this.originalTokenRepo.findOne(tokenId);
        if (!token) {
          throw new NotFoundException("No Such Token exist.")
        }
        const interchainToken = await this.service.getInterChainToken(token.id, chainId)
        return { interchainToken }
    }

    @Post('/:tokenId/:chainId')
    @UseGuards(JwtAuthGuard)
    async requestInterChainTokenCreationPermit(
        @CurrentUserId() ownerId: number,
        @Param('tokenId', ParseIntPipe) tokenId: number,
        @Param('chainId', ParseChainIdPipe) chainId: ChainId,
    ): Promise<any> {
        const interchainToken = await this.service.getInterChainToken(tokenId, chainId)
        console.info('interchainToken', interchainToken)
        if (interchainToken) {
            throw new ConflictException(`Creation permit was created already for token on chainId ${chainId}`)
        }
        const token = await this.originalTokenRepo.findOne(tokenId, {
            relations: ['owner']
        });
        if (!token) {
          throw new NotFoundException("No Such Token exist.")
        }
        if (token.owner.id !== ownerId) {
            console.error(`Expected ${token.owner.id}, got ${ownerId}`)
            throw new BadRequestException("You are not the owner of this token.")
        }
        const permit = await this.service.requestInterChainCreationPermit(token, chainId)
        return { permit }
    }

    @Post('/:tokenId/:chainId/enable')
    // @UseGuards(JwtAuthGuard)
    async enableInterChainToken(
        // @CurrentUserId() ownerId: number,
        @Param('tokenId', ParseIntPipe) tokenId: number,
        @Param('chainId', ParseChainIdPipe) chainId: ChainId,
    ): Promise<any> {
        const interchainToken = await this.service.getInterChainToken(tokenId, chainId)
        if (!interchainToken) {
            throw new NotFoundException(`Not found for token on chainId ${chainId}`)
        }
        await this.service.enableICToken(interchainToken)
        return { isCreated: true }
    }

    @Post('/:tokenId/:chainId/deposit')
    @UseGuards(JwtAuthGuard)
    async depositTokenToInterchain(
        @CurrentUserId() ownerId: number,
        @Param('tokenId', ParseIntPipe) tokenId: number,
        @Param('chainId', ParseChainIdPipe) chainId: ChainId,
    ): Promise<any> {
        const interchainToken = await this.service.getInterChainToken(tokenId, chainId)
        // if (!interchainToken) {
        //     throw new NotFoundException(`Creation permit was created already for token on chainId ${chainId}`)
        // }
        // // @todo: transfer to Parking

        // // @todo: create mint permit for interchain token
        // const permit = await this.service.requestInterChainCreationPermit(token, chainId)
        // return { permit }
    }
}
