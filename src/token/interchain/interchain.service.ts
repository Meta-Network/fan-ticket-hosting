import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers, utils, Wallet } from 'ethers';
import { BigNumber } from 'ethers';
import { ChainId, currentChainId } from 'src/constant';
import { currentContracts, InterChainContracts } from 'src/constant/contracts';
import { currentProvider, providers } from 'src/constant/providers';
import { OnlyCreatedICToken } from 'src/decorators/interchain-token.decorator';
import { Account } from 'src/entities/Account';
import { InterChainInTransaction } from 'src/entities/InterChainInTransaction';
import { InterChainToken } from 'src/entities/InterChainToken';
import {
  InterChainTransaction,
  InterChainTransactionType,
} from 'src/entities/InterChainTransaction';
import { OutTransaction, TransactionType } from 'src/entities/OutTransaction';
import { Token } from 'src/entities/Token';
import { TransactionStatus } from 'src/types';
import {
  InterChainFanTicket,
  InterChainFanTicketFactory,
  InterChainFanTicketFactory__factory,
  InterChainFanTicket__factory,
  InterChainParking,
  InterChainParking__factory,
} from 'src/types/contracts';
import { Repository } from 'typeorm';
import { TokenService } from '../token.service';
import { InterChainPermitService } from './permit';
import { MintOrder } from './typing';

@Injectable()
export class InterchainService {
  private adminWallet: Wallet;
  private parkingContract: InterChainParking;
  logger: Logger;

  constructor(
    @InjectRepository(InterChainTransaction)
    private readonly icTxRepo: Repository<InterChainTransaction>,
    @InjectRepository(InterChainToken)
    private readonly icTokenRepo: Repository<InterChainToken>,
    @InjectRepository(InterChainInTransaction)
    private readonly icTokenWithdrawBackTxRepo: Repository<InterChainInTransaction>,
    @InjectRepository(OutTransaction)
    private readonly txRepo: Repository<OutTransaction>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly configService: ConfigService,
    @InjectRepository(Account)
    private readonly accRepo: Repository<Account>,
    private readonly tokenService: TokenService
  )
  {
    this.logger = new Logger('InterchainTokenService');
    // @load this from config
    const privateKey = configService.get<string>(
      'privateKeys.creationPermitSigner',
    );
    this.adminWallet = new Wallet(privateKey);
    this.logger.verbose(`Permit Signer Wallet is ${this.adminWallet.address}`);
    this.parkingContract = InterChainParking__factory.connect(
      currentContracts.Parking,
      this.adminWallet,
    );
  }

  getInfoForChain(targetChainId: ChainId): { 
    provider: ethers.providers.JsonRpcProvider, 
    connectedAdminWallet: Wallet, 
    connectedFactory: InterChainFanTicketFactory
  } {
    const provider = providers[targetChainId];
    const connectedAdminWallet = this.adminWallet.connect(
      providers[targetChainId],
    );
    const connectedFactory = InterChainFanTicketFactory__factory.connect(
      InterChainContracts[targetChainId].Factory,
      provider,
    );
    return { provider, connectedAdminWallet, connectedFactory };
  }

  /**
   * get interchain token by original token's id
   * @param tokenId the original token's id
   * @returns its interchain tokens
   */
  async getInterChainTokens(tokenId: number): Promise<InterChainToken[]> {
    const matched = await this.icTokenRepo.find({
      where: { origin: { id: tokenId } },
    });
    return matched;
  }

  /**
   * 
   * @param tokenId the original token's id
   * @param targetChainId the chain id
   * @returns its interchain token (if exist)
   */
  async getInterChainToken(
    tokenId: number,
    targetChainId: ChainId,
  ): Promise<InterChainToken | null> {
    const matched = await this.icTokenRepo.findOne({
      where: {
        origin: { id: tokenId },
        chainId: targetChainId,
      },
      relations: ['origin']
    });
    return matched;
  }

  /**
   * create interchain token for the `token`
   * @param token the original token
   * @param targetChainId the new interchain token's location
   * @returns the permit to create interchain token
   */
  async requestInterChainCreationPermit(token: Token, targetChainId: ChainId): Promise<InterChainToken> {
    if (!InterChainContracts[targetChainId]) {
      throw new BadRequestException(`Unsupported network id ${targetChainId}`);
    }
    const matched = await this.getInterChainToken(token.id, targetChainId);
    if (matched) {
      throw new ConflictException(
        `Interchain token was created for chain ${targetChainId}`,
      );
    }
    const targetProvider = providers[targetChainId];
    const adminWallet = this.adminWallet.connect(providers[targetChainId]);
    const icFTFactory = InterChainFanTicketFactory__factory.connect(
      InterChainContracts[targetChainId].Factory,
      targetProvider,
    );
    const creationPermit = await InterChainPermitService.CreationPermitConstuctor(
      icFTFactory,
      adminWallet,
      token.address,
      token.name,
      token.symbol,
      token.id,
      currentChainId,
    );
    const computedCreationAddress = await icFTFactory.computeAddress(
      token.name,
      token.symbol,
    );

    // write the permit into the DB
    const saved = await this.icTokenRepo.save({
      r: creationPermit.r,
      s: creationPermit.s,
      v: creationPermit.v,
      origin: token,
      chainId: targetChainId,
      address: computedCreationAddress,
      txHash: null,
      status: TransactionStatus.PENDING,
    });

    return saved;
  }

  /**
   * mark interchain token as active in db
   * @param token the interchain token object
   * @returns is enabled in the db or not
   */
  async enableICToken(token: InterChainToken): Promise<boolean> {
    if (token.status === TransactionStatus.SUCCESS) {
      throw new BadRequestException("Token was enabled already");
    }
    const contract = InterChainFanTicket__factory.connect(
      token.address,
      providers[token.chainId]
    );
    try {
      // should be able to call if deployed
      await contract.name()
    } catch (error) {
      throw new BadRequestException("Failed to call `name`, please make sure the contract was deployed. Contact support team if you need help.");
    }
    await this.icTokenRepo.update(token.id, {
      status: TransactionStatus.SUCCESS,
      r: '', s: '', v: 0
    })
    return true;
  }

  /**
   * Locking the `value` of `originalToken` to the parking contract.
   * After locking, we can issue the ictoken for the user.
   * @param originalToken the original token
   * @param ownerId the owner's user id
   * @param value the amount to parking at ic parking
   * @param password the unlock password of owner's wallet
   * @returns a token's transaction to froze `value` on ic parking contract
   */
  async depositToParking(
    originalToken: Token,
    ownerId: number,
    value: BigNumber,
    password: string
  ): Promise<OutTransaction> {
    const ownerWallet = await this.accRepo.findOne(ownerId);
    // transfer to Parking
    return this.tokenService.transfer(
      originalToken, ownerWallet, this.parkingContract.address, value, password,
      TransactionType.INTERCHAIN_DEPOSIT
    );
  }

  /**
   * generate permit to mint InterChainToken
   * require user's action to send since we are not paying for *any* interchain tx
   * @param token the InterChainToken token
   * @param to the receiver of interchain minting
   * @param value the amount to mint
   */
  @OnlyCreatedICToken
  async mint(token: InterChainToken, to: string, value: BigNumber, parkingDepositTx: OutTransaction): Promise<MintOrder> {
    const { connectedAdminWallet, provider } = this.getInfoForChain(
      token.chainId,
    );
    const formattedTo = utils.getAddress(to);
    const connectedFanTicket = InterChainFanTicket__factory.connect(
      token.address,
      provider,
    );
    // get mint nonce from DB
    const nonce = await this.getICDepositNonce(token, formattedTo);
    const permit = await InterChainPermitService.MintOrderConstuctor(
      connectedFanTicket,
      connectedAdminWallet,
      formattedTo,
      value,
      nonce,
    );
    await this.icTxRepo.save({
      type: InterChainTransactionType.MINT,
      relatedTx: parkingDepositTx,
      token,
      from: parkingDepositTx.from,
      value: value.toString(),
      r: permit.r, s: permit.s, v: permit.v, deadline: permit.deadline,
      txHash: null,
      status: TransactionStatus.PENDING,
      to: formattedTo,
    })
    return permit;
  }

  /**
   * check interchain withdraw (ic=>origin) tx status
   * @param token the interchain Token
   * @param txHash the transaction hash of burn in otherchain
   */
  async checkInterChainTokenWithdraw(chain: ChainId, txHash: string, icToken: InterChainToken) {
    // check is tx exist in DB or not
    const matchedBurn = await this.icTxRepo.findOne({
      txHash,
    });
    console.info('matchedBurn', matchedBurn)
    if (matchedBurn) {
      throw new BadRequestException('Tx is already in the DB');
    }

    const receipt = await providers[chain].getTransactionReceipt(txHash);

    if (!receipt) {
        throw new Error(`Tx Not found on chain ${chain}, please double check and try again later`);
    }

    if (receipt.to !== icToken.address) {
      throw new Error("Not target token");
    }

    // const icToken = await this.icTokenRepo.findOne({
    //   where: {
    //     address: receipt.to,
    //     chainId: chain
    //   },
    // });

    // if (!icToken) {
    //   throw new Error("Sorry but it seems it's not our interchained token.");
    // }

    // check txHash is burnt or not & parse events from receipt
    const icTokenContract = InterChainFanTicket__factory.connect(icToken.address, providers[icToken.chainId]);
    const parsedLogs = receipt.logs.map(log => icTokenContract.interface.parseLog(log))
    const icBurnEvents = parsedLogs.filter((l) => l.name === 'InterChainFanTicketBurnt').map(({ args }) => {
      return { 
        burner: args.who, receiver: args.burntToTarget, value: args.value
      }
    })
    return {icBurnEvents}
  }
  

  /**
   * get the nonce for original token => ic token
   * @param token the interchain token object
   * @param to the ic token recipient wallet
   * @returns the nonce
   */
  async getICDepositNonce(
    token: InterChainToken,
    to: string,
  ): Promise<number> {
    // get nonce = get withdraw tx count
    const depositTxs = await this.icTxRepo.find({
      where: {
        token: { id: token.id },
        to: utils.getAddress(to),
        type: InterChainTransactionType.MINT,
      },
    });
    return depositTxs.length;
  }

  /**
   * get the nonce for ic token => original token
   * @param token the interchain token object
   * @param to the original token recipient wallet
   * @returns the nonce
   */
  async getICWithdrawNonce(
    token: InterChainToken,
    to: string,
  ): Promise<number> {
    // get nonce = get withdraw tx count
    const withdrawTxs = await this.icTokenWithdrawBackTxRepo.find({
      where: {
        icToken: { id: token.id },
        to: utils.getAddress(to),
      },
    });
    return withdrawTxs.length;
  }

  /**
   * write a transaction to give back the original token
   * @param token the interchain token
   * @param from from wallet
   * @param to to wallet
   * @param value value to be transfer
   */
  async redeemInterChainToken(
    token: InterChainToken,
    from: string,
    to: string,
    value: BigNumber,
  ): Promise<void> {
    const nonce = await this.getICWithdrawNonce(token, to);
    // generate a `Withdraw` permit of Parking contract
    const permit = await InterChainPermitService.ParkingWithdrawConstuctor(
      this.parkingContract,
      token.origin.address,
      this.adminWallet.connect(currentProvider),
      to,
      value,
      nonce,
    );
    // write a transaction to call `withdraw` on Parking contract
    await this.icTokenWithdrawBackTxRepo.save({
      from, to, value: value.toString(),
      icToken: { id: token.id }, token: { id: token.originId },
      r: permit.r, s: permit.s, v: permit.v, deadline: permit.deadline,
      txHash: null, status: TransactionStatus.PENDING,
    })
  }
}
