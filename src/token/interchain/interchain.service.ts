import { Injectable, NotImplementedException } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { InterChainToken } from 'src/entities/InterChainToken';
import { Token } from 'src/entities/Token';

@Injectable()
export class InterchainService {
    async requestInterChainCreationPermit(token: Token) {

        throw new NotImplementedException("T.B.I");
    }
    async mintInterChainToken(token: InterChainToken, to: string, value: BigNumber) {
        throw new NotImplementedException("T.B.I");
    }
    async redeemInterChainToken(token: InterChainToken, txHash: string) {
        // @todo: check is tx exist in DB or not

        // @todo: check txHash is burnt or not
        throw new NotImplementedException("T.B.I");
    }
}
