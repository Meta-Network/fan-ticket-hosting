import { BadRequestException, ConflictException, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { BigNumber } from 'ethers';
import { ChainId, currentChainId } from 'src/constant';
import { InterChainContracts } from 'src/constant/contracts';
import { providers } from 'src/constant/providers';
import { InterChainToken } from 'src/entities/InterChainToken';
import { InterChainTransaction } from 'src/entities/InterChainTransaction';
import { Token } from 'src/entities/Token';
import { TransactionStatus } from 'src/types';
import { InterChainFanTicketFactory__factory, InterChainFanTicket__factory } from 'src/types/contracts';
import { Repository } from 'typeorm';
import { InterChainPermitService } from './permit';

@Injectable()
export class InterchainService {
    private adminWallet: Wallet;

    constructor(
        @InjectRepository(InterChainTransaction)
        private readonly txRepo: Repository<InterChainTransaction>,
        @InjectRepository(InterChainToken)
        private readonly icTokenRepo: Repository<InterChainToken>,
    ) {
        // @todo: load this from config
        this.adminWallet = Wallet.createRandom()
    }


    getInfoForChain(targetChainId: ChainId) {
        const provider = providers[targetChainId];
        const connectedAdminWallet = this.adminWallet.connect(providers[targetChainId]);
        const connectedFactory = InterChainFanTicketFactory__factory.connect(
            InterChainContracts[targetChainId].Factory,
            provider
        )
        return { provider, connectedAdminWallet, connectedFactory }
    }

    async getInterChainTokens(tokenId: number): Promise<InterChainToken[]> {
        const matched = await this.icTokenRepo.find({
            where: { origin: { id: tokenId } }
        })
        return matched;
    }

    async getInterChainToken(tokenId: number, targetChainId: ChainId): Promise<InterChainToken> {
        const matched = await this.icTokenRepo.findOne({
            where: {
                origin: { id: tokenId },
                chainId: targetChainId
            }
        })
        return matched;
    }

    async requestInterChainCreationPermit(token: Token, targetChainId: ChainId) {
        if (!InterChainContracts[targetChainId]) {
            throw new BadRequestException(`Unsupported network id ${targetChainId}`)
        }
        const matched = await this.getInterChainToken(token.id, targetChainId)
        if (matched) {
            throw new ConflictException(`Interchain token was created for chain ${targetChainId}`)
        }
        const targetProvider = providers[targetChainId];
        const adminWallet = this.adminWallet.connect(providers[targetChainId]);
        const icFTFactory = InterChainFanTicketFactory__factory.connect(
            InterChainContracts[targetChainId].Factory,
            targetProvider
        )
        const creationPermit = await InterChainPermitService.CreationPermitConstuctor(
            icFTFactory,
            adminWallet,
            token.address,
            token.name,
            token.symbol,
            token.id,
            currentChainId
        )
        const computedCreationAddress = await icFTFactory.computeAddress(token.name, token.symbol);

        // write the permit into the DB
        await this.icTokenRepo.save({
            r: creationPermit.r, s: creationPermit.s, v: creationPermit.v,
            origin: token, chainId: currentChainId, 
            address: computedCreationAddress, 
            txHash: null, status: TransactionStatus.PENDING
        })

        return creationPermit;
    }

    /**
     * generate permit to mint InterChainToken
     * require user's action to send since we are not paying for *any* interchain tx
     * @param token the InterChainToken token
     * @param to the receiver of interchain minting
     * @param value the amount to mint
     */
    async mint(token: InterChainToken, to: string, value: BigNumber) {
        throw new NotImplementedException("T.B.I");

        const { connectedAdminWallet, provider } = this.getInfoForChain(token.chainId)
        const connectedFanTicket = InterChainFanTicket__factory.connect(token.address, provider);
        // connectedFanTicket.mint
        // @todo: get mint nonce from DB
        // const nonce = await connectedFanTicket.nonces(this.adminWallet.address);
        const permit = await InterChainPermitService.MintOrderConstuctor(
            connectedFanTicket,
            connectedAdminWallet,
            to,
            value,
            0
        )
    }

    /**
     * 
     * @param token the interchain Token
     * @param txHash the transaction hash of burn in otherchain
     */
    async redeemInterChainToken(chain: ChainId,txHash: string) {
        // @todo: check is tx exist in DB or not

        // @todo: find token address from txHash, and search interchain token in db

        // @todo: check txHash is burnt or not
        throw new NotImplementedException("T.B.I");
    }
}
