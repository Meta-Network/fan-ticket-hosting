import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'ethers';
import { Wallet } from 'ethers';
import { Token } from '../entities/Token';
import { currentContracts } from '../constant/contracts';
import { currentProvider } from '../constant/providers';
import {
  FanTicketFactory,
  FanTicketFactory__factory,
  FanTicketV2__factory,
} from '../types/contracts';
import { PermitService } from './permits';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/Account';
import { OutTransaction, TransactionType } from 'src/entities/OutTransaction';

@Injectable()
export class TokenService {
  #creationPermitSigner: Wallet;
  logger: Logger;

  factoryContract: FanTicketFactory;

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    @InjectRepository(OutTransaction)
    private readonly txRepo: Repository<OutTransaction>,
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

  async getNonceOf(token: Token, from: Account): Promise<number> {
    const userTxs = await this.txRepo.find({
      where: { token: { id: token.id }, from: { id: from.id } },
    });
    console.info(`relatedTxs for ${from.id} is ${userTxs.length}`)
    return userTxs.length;
  }

  async transfer(
    _token: Token,
    from: Account,
    to: string,
    value: BigNumber,
    password: string
  ): Promise<void> {
    const tokenContract = FanTicketV2__factory.connect(_token.address, currentProvider);

    // get nonce from DB
    const nonce = await this.getNonceOf(_token, from);
    const fromWallet = await Wallet.fromEncryptedJson(from.keystore, password)

    const permit = await PermitService.TransferOrderConstuctor(
      tokenContract,
      fromWallet,
      to,
      value,
      nonce,
    );
    // write permit into DB for clearing
    await this.txRepo.save({
      token: _token,
      from,
      to,
      type: TransactionType.TRANSFER,
      // use hexstring for storage
      value: value.toHexString(),
      deadline: permit.deadline,
      v: permit.v, r: permit.r, s: permit.s,
    })
  }

  async mint(
    _token: Token,
    minter: Account,
    to: string,
    value: BigNumber,
    password: string
  ): Promise<void> {
    const token = FanTicketV2__factory.connect(_token.address, currentProvider);
    // get nonce from DB
    const nonce = await this.getNonceOf(_token, minter);

    const minterWallet = await Wallet.fromEncryptedJson(minter.keystore, password);
    const permit = await PermitService.MintOrderConstuctor(
      token,
      minterWallet,
      to,
      value,
      nonce,
    );
    // write permit into DB for clearing
    await this.txRepo.save({
      token: _token,
      from: minter,
      to,
      type: TransactionType.MINT,
      // use hexstring for storage
      value: value.toHexString(),
      deadline: permit.deadline,
      v: permit.v, r: permit.r, s: permit.s,
    })
  }
}
