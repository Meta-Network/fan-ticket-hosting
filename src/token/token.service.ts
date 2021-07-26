import { Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { Wallet } from 'ethers';
import { currentProvider } from 'src/constant/providers';
import {
  FanTicketFactory,
  FanTicketFactory__factory,
  FanTicketV2__factory,
} from '../types/contracts';
import { PermitService } from './permits';

@Injectable()
export class TokenService {
  factoryContract: FanTicketFactory;

  constructor() {
    const factoryAddress = '0x...';
    this.factoryContract = FanTicketFactory__factory.connect(
      factoryAddress,
      currentProvider,
    );
  }

  async create(
    name: string,
    symbol: string,
    tokenId: number,
    ownerWalletAddress: string,
    initialSupply: BigNumber,
  ): Promise<void> {
    // @todo: real admin wallet
    const adminWallet = Wallet.createRandom();
    const permit = await PermitService.CreationPermitConstuctor(
      this.factoryContract,
      adminWallet,
      name,
      symbol,
      ownerWalletAddress,
      tokenId,
      initialSupply,
    );
    // @todo: write permit to DB and use multicall to `newAPeggedToken`
    // const tx = await this.factoryContract.newAPeggedToken(
    //   name,
    //   symbol,
    //   ownerWalletAddress,
    //   initialSupply,
    //   tokenId,
    //   permit.v,
    //   permit.r,
    //   permit.s,
    // );
    // return tx.hash;
  }

  async transfer(
    tokenAddress: string,
    from: Wallet,
    to: string,
    value: BigNumber,
  ): Promise<void> {
    const token = FanTicketV2__factory.connect(tokenAddress, currentProvider);
    // @todo; get nonce from DB

    const nonce = 0;
    const permit = await PermitService.TransferOrderConstuctor(
      token,
      from,
      to,
      value,
      nonce,
    );
    // @todo: write permit into DB for clearing
  }

  async mint(
    tokenAddress: string,
    minter: Wallet,
    to: string,
    value: BigNumber,
  ): Promise<void> {
    const token = FanTicketV2__factory.connect(tokenAddress, currentProvider);
    // @todo; get nonce from DB

    const nonce = 0;
    const permit = await PermitService.MintOrderConstuctor(
      token,
      minter,
      to,
      value,
      nonce,
    );
    // @todo: write permit into DB for clearing
  }
}
