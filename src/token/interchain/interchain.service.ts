import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
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
  InterChainFanTicketFactory__factory,
  InterChainFanTicket__factory,
  InterChainParking,
  InterChainParking__factory,
} from 'src/types/contracts';
import { Repository } from 'typeorm';
import { TokenService } from '../token.service';
import { InterChainPermitService } from './permit';

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
    private readonly icTokenDepositTxRepo: Repository<InterChainInTransaction>,
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

  getInfoForChain(targetChainId: ChainId) {
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

  async getInterChainTokens(tokenId: number): Promise<InterChainToken[]> {
    const matched = await this.icTokenRepo.find({
      where: { origin: { id: tokenId } },
    });
    return matched;
  }

  async getInterChainToken(
    tokenId: number,
    targetChainId: ChainId,
  ): Promise<InterChainToken> {
    const matched = await this.icTokenRepo.findOne({
      where: {
        origin: { id: tokenId },
        chainId: targetChainId,
      },
      relations: ['origin']
    });
    return matched;
  }

  async requestInterChainCreationPermit(token: Token, targetChainId: ChainId) {
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
  async mint(token: InterChainToken, to: string, value: BigNumber, parkingDepositTx: OutTransaction) {
    const { connectedAdminWallet, provider } = this.getInfoForChain(
      token.chainId,
    );
    const connectedFanTicket = InterChainFanTicket__factory.connect(
      token.address,
      provider,
    );
    // get mint nonce from DB
    const nonce = await this.getICDepositNonce(token, to);
    const permit = await InterChainPermitService.MintOrderConstuctor(
      connectedFanTicket,
      connectedAdminWallet,
      to,
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
      to,
    })
    return permit;
  }

  /**
   *
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
  

  async getICDepositNonce(
    token: InterChainToken,
    to: string,
  ): Promise<number> {
    // get nonce = get withdraw tx count
    const depositTxs = await this.icTxRepo.find({
      where: {
        token: { id: token.id },
        to,
        type: InterChainTransactionType.MINT,
      },
    });
    return depositTxs.length;
  }

  async getICWithdrawNonce(
    token: InterChainToken,
    to: string,
  ): Promise<number> {
    // get nonce = get withdraw tx count
    const withdrawTxs = await this.icTokenDepositTxRepo.find({
      where: {
        token: { id: token.id },
        to,
      },
    });
    return withdrawTxs.length;
  }

  async redeemInterChainToken(
    token: InterChainToken,
    from: string,
    to: string,
    value: BigNumber,
  ) {
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
    await this.icTokenDepositTxRepo.save({
      from, to, value: value.toString(),
      icToken: { id: token.id }, token: { id: token.originId },
      r: permit.r, s: permit.s, v: permit.v, deadline: permit.deadline,
      txHash: null, status: TransactionStatus.PENDING,
    })
  }
}
