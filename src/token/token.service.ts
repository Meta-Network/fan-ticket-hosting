import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
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
import { BigNumberish } from 'ethers';
import { OnlyPublishedToken } from 'src/decorators/token.decorator';
import { ClearingHouseService } from 'src/clearing-house/clearing-house.service';

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
    private readonly configService: ConfigService,
    private readonly chService: ClearingHouseService
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

  private async _unlockWallet(keystore: string, password: string): Promise<Wallet> {
    try {
      const wallet = await Wallet.fromEncryptedJson(keystore, password)     
      return wallet 
    } catch (error) {
      throw new BadRequestException("Failed when unlocking wallet, please check your password.")
    }
  }

  parseBigNumber(bnish: BigNumberish): BigNumber {
    try {
      return BigNumber.from(bnish);
    } catch (error) {
      throw new BadRequestException("Failed to parse the number, please try again");
    }
  }

  /**
   * Effectively Equal to  `transfer()` , but we customed based on EIP-712's `TypedSignature`
   * named `transferFromBySig()`，in order to batch them for clearing
   * @param _token Token Object
   * @param from same as transferFrom(from)
   * @param to same as transferFrom(from, to)
   * @param value same as transferFrom(from, to, value)
   * @param password The password to unlock the wallet
   */
  @OnlyPublishedToken
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
    const fromWallet = await this._unlockWallet(from.keystore, password)

    const permit = await PermitService.TransferOrderConstuctor(
      tokenContract,
      fromWallet,
      to,
      value,
      nonce,
    );
    const tx = {
      token: _token,
      from,
      to,
      type: TransactionType.TRANSFER,
      // use hexstring for storage
      value: value.toHexString(),
      deadline: permit.deadline,
      v: permit.v, r: permit.r, s: permit.s,
    };
    // throw Error if estimate was reverted
    await this.chService.estimateTransactionStatus(tx as OutTransaction);
    // write permit into DB for clearing
    await this.txRepo.save(tx)
  }

  /**
   * Effectively Equal to `IERC20.mint()`, but we customed based on EIP-712's `TypedSignature`
   * to build `mintBySig()`, in order to batch them for clearing
   * @param _token Token Object
   * @param from the account who operate `mint`, have to be the minter of this token
   * @param to mint target
   * @param value The amount to mint
   * @param password The password to unlock the wallet
   */
  @OnlyPublishedToken
  async mint(
    _token: Token,
    minter: Account,
    to: string,
    value: BigNumber,
    password: string
  ): Promise<void> {
    // @todo check minter role
    const token = FanTicketV2__factory.connect(_token.address, currentProvider);
    // get nonce from DB
    const nonce = await this.getNonceOf(_token, minter);

    const minterWallet = await this._unlockWallet(minter.keystore, password);
    const permit = await PermitService.MintOrderConstuctor(
      token,
      minterWallet,
      to,
      value,
      nonce,
    );
    const tx = {
      token: _token,
      from: minter,
      to,
      type: TransactionType.MINT,
      // use hexstring for storage
      value: value.toHexString(),
      deadline: permit.deadline,
      v: permit.v, r: permit.r, s: permit.s,
    }
    // throw Error if estimate was reverted
    await this.chService.estimateTransactionStatus(tx as OutTransaction);
    // write permit into DB for clearing
    await this.txRepo.save(tx)
  }

  /**
   * Effectively Equal to `IERC20.approve()`, but using EIP-2612's `permit`，in order to batch them for clearing
   * This is a reserved port only for other contract that support 2612 (e.g Uniswap)
   * normally we use `transfer`.
   * @param _token Token Object
   * @param from same as approve(from)
   * @param spender same as approve(from, spender)
   * @param value same as approve(from, spender, value)
   * @param password The password to unlock the wallet
   */
  @OnlyPublishedToken
  async approve(
    _token: Token,
    from: Account,
    spender: string,
    value: BigNumber,
    password: string
  ): Promise<void> {
    const tokenContract = FanTicketV2__factory.connect(_token.address, currentProvider);

    // get nonce from DB
    const nonce = await this.getNonceOf(_token, from);
    const fromWallet = await this._unlockWallet(from.keystore, password)

    const permit = await PermitService.ApproveOrderConstructor(
      tokenContract,
      fromWallet,
      spender,
      value,
      nonce,
    );
    const tx = {
      token: _token,
      from,
      to: spender,
      type: TransactionType.APPROVE,
      // use hexstring for storage
      value: value.toHexString(),
      deadline: permit.deadline,
      v: permit.v, r: permit.r, s: permit.s,
    };
    // approve does not need approve
    // since clearing house is not `transferFrom`
    // do `transferFrom` with `transferFromBySig`
    // write permit into DB for clearing
    await this.txRepo.save(tx)
  }
}
