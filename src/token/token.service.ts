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
  #operatorWallet: Wallet;
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
    const privateKey = configService.get<string>('operatorWallet.privateKey');
    this.#operatorWallet = new Wallet(privateKey, currentProvider)
    this.logger.verbose(`Operator Wallet is ${this.#operatorWallet.address}`)
  }

  async handleTokenIssueRequest(): Promise<void> {
    const tokensNeedToDeploy = await this.tokenRepo.find({ status: TransactionStatus.PENDING })
    const notPendingTokens = tokensNeedToDeploy.filter(
      t => t.status !== TransactionStatus.PENDING,
    );
    if (notPendingTokens.length > 0) {
      this.logger.verbose(
        `Not Pending Token Ids: ${notPendingTokens.map(t => t.id).join(', ')}`,
      );
      throw new Error('handleTokenIssueRequest only receives PENDING tokens. ');
    }

    const calls: Array<{
      target: string;
      callData: string;
    }> = tokensNeedToDeploy.map(t => {
      const callData = this.factoryContract.interface.encodeFunctionData('newAPeggedToken', [
        t.name,
        t.symbol,
        t.owner.address,
        t.totalSupply,
        t.id,
        t.v,
        t.r,
        t.s,
      ]);
      return { target: this.factoryContract.address, callData }
    })
    const multicall = Multicall__factory.connect(currentMulticall, this.#operatorWallet);
    // try with call static to see is there anything wrong.
    const estimatedGas = await multicall.estimateGas.aggregate(calls);
    this.logger.verbose(`Estimated Gas for deploying ${calls.length} token(s): ${estimatedGas.toString()}`)
    // 1 blockchain call, that includes all these creations call
    const tx = await multicall.aggregate(calls);
    const hash = tx.hash
    const deployed = tokensNeedToDeploy.map(t => {
      return { ...t, txHash: hash, status: TransactionStatus.SENDING }
    })
    console.info('deployed', deployed)
    
    // update their status to `TransactionStatus.SENDING` with TxHash
    await this.tokenRepo.update({ id: In(deployed.map(t => t.id)) }, {
      txHash: hash, status: TransactionStatus.SENDING
    });
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
      this.#operatorWallet,
      name,
      symbol,
      owner.address,
      token.id,
      initialSupply,
    );
    token = { ...token, r: permit.r, s: permit.s, v: permit.v }
    // @todo: write permit to DB and use multicall to `newAPeggedToken`
    await this.tokenRepo.save(token)
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
