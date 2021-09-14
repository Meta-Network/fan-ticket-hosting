import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, utils } from 'ethers';
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

  /**
   * a simple function to validate a token creation, Exception will be throwed if happened
   * @param symbol the symbol of a new token
   * @param owner the wallet address of the people who wish to issue a new token
   */
  private async checkIsLegitToCreate(symbol: string, owner: Account): Promise<void> {
    const [matchedOwner, matchedSymbol] = await Promise.all([
      this.tokenRepo.findOne({ owner: { id: owner.id } }),
      this.tokenRepo.findOne({ symbol })
    ]);
    if (matchedOwner) {
      throw new ConflictException("Sorry, you have a token already.")
    }
    // const matched = await this.tokenRepo.findOne({ symbol });
    if (matchedSymbol) {
      throw new ConflictException("Sorry, but this symbol was taken by others.")
    }
  }


  /**
   * Create Token, will create a creation permit on admin's behalf
   * And save to the token list, let the cron handle the new token's creation all together.
   * @param name the name of the new token
   * @param symbol the symbol of the new token
   * @param owner the owner who can issue the new token
   * @param initialSupply the initial supply of the new token
   */
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

  /**
   * get the nonce (sequence number) of Token transaction, 
   * as Meta Transaction will need the `nonce` property to avoid replay attack.
   * the nonce is depend on transactions in database made by the sender with the token
   * @param token the token of transaction involved
   * @param from the user of transaction involved
   * @returns the nonce for the token and the user
   */
  async getNonceOf(token: Token, from: Account): Promise<number> {
    const userTxs = await this.txRepo.find({
      where: { token: { id: token.id }, from: { id: from.id } },
    });
    console.info(`relatedTxs for ${from.id} is ${userTxs.length}`)
    return userTxs.length;
  }

  /**
   * Unlock the wallet with keystore and password
   * @param keystore the keystore object string
   * @param password the password that unlock the wallet
   * @returns a active wallet
   */
  private async _unlockWallet(keystore: string, password: string): Promise<Wallet> {
    try {
      const wallet = await Wallet.fromEncryptedJson(keystore, password)     
      return wallet 
    } catch (error) {
      throw new BadRequestException("Failed when unlocking wallet, please check your password.")
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
    password: string,
    type = TransactionType.TRANSFER
  ): Promise<OutTransaction> {
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
      type,
      // use hexstring for storage
      value: value.toHexString(),
      deadline: permit.deadline,
      v: permit.v, r: permit.r, s: permit.s,
    };
    // throw Error if estimate was reverted
    await this.chService.estimateTransactionStatus(tx as OutTransaction);
    // write permit into DB for clearing
    return this.txRepo.save(tx)
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
  ): Promise<OutTransaction> {
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
    return this.txRepo.save(tx)
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
  ): Promise<OutTransaction> {
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
    // use clearing house to do `approve` with `permit`
    // write permit into DB for clearing
    return this.txRepo.save(tx)
  }
}
