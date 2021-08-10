import { Injectable, NotImplementedException } from '@nestjs/common';
import { Wallet } from 'ethers';
import { BigNumber } from 'ethers';
import { ChainId, currentChainId } from 'src/constant';
import { InterChainContracts } from 'src/constant/contracts';
import { providers } from 'src/constant/providers';
import { InterChainToken } from 'src/entities/InterChainToken';
import { Token } from 'src/entities/Token';
import { InterChainFanTicketFactory__factory, InterChainFanTicket__factory } from 'src/types/contracts';
import { InterChainPermitService } from './permit';

@Injectable()
export class InterchainService {
    private adminWallet: Wallet;

    constructor() {
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

    async requestInterChainCreationPermit(token: Token, targetChainId: ChainId) {
        // @todo: check is InterChain Token exist for `token` and `targetChainId`
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
        // @todo: write the permit into the DB
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
