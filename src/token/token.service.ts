import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'ethers';
import { Wallet } from 'ethers';
import { Token } from '../entities/Token';
import { currentContracts, currentMulticall } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import { TransactionStatus } from '../types';
import {
  FanTicketFactory,
  FanTicketFactory__factory,
  FanTicketV2__factory,
} from '../types/contracts';
import { PermitService } from './permits';
import { Multicall__factory } from 'src/types/contracts/MulticallFactory';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';

@Injectable()
export class TokenService {
  #creationPermitSigner: Wallet;
  logger: Logger;

  factoryContract: FanTicketFactory;

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly configService: ConfigService
  ) {
    this.factoryContract = FanTicketFactory__factory.connect(
      currentContracts.Factory,
      currentProvider,
    );
    this.logger = new Logger('TokenService')
    const privateKey = configService.get<string>('privateKeys.creationPermitSigner');
    this.#creationPermitSigner = new Wallet(privateKey, currentProvider)
    this.logger.verbose(`Permit Signer Wallet is ${this.#creationPermitSigner.address}`)
  }

  private async checkIsLegitToCreate(symbol: string, owner: Account): Promise<void> {
    const matchedOwner = await this.tokenRepo.findOne({ owner: { id: owner.id } });
    if (matchedOwner) {
      throw new ConflictException("Sorry, you have a token already.")
    }
    const matched = await this.tokenRepo.findOne({ symbol });
    if (matched) {
      throw new ConflictException("Sorry, but this symbol was taken by others.")
    }
  }

  async create(
    name: string,
    symbol: string,
    owner: Account,
    initialSupply: BigNumber,
  ): Promise<void> {
    // check on `symbol` exist or not
    await this.checkIsLegitToCreate(symbol, owner)

    const computedAddress = await this.factoryContract.computeAddress(name, symbol);
    let token = await this.tokenRepo.save({
      name, symbol, totalSupply: initialSupply.toString(), owner,
      address: computedAddress,
    })
    const permit = await PermitService.CreationPermitConstuctor(
      this.factoryContract,
      this.#creationPermitSigner,
      name,
      symbol,
      owner.address,
      token.id,
      initialSupply,
    );
    token = { ...token, r: permit.r, s: permit.s, v: permit.v }
    await this.tokenRepo.save(token)
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
