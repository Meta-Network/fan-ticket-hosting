import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { Logger } from '@nestjs/common';
import { currentProvider } from 'src/constant/providers';
import { Account } from 'src/entities/Account';
import { Repository } from 'typeorm';
import { Token } from '../entities/Token';
import { TransactionStatus } from 'src/types';

@Injectable()
export class WalletService {
  #operatorWallet: Wallet;
  logger: Logger;
  constructor(
    @InjectRepository(Account)
    private readonly walletAccountRepo: Repository<Account>,
    private readonly configService: ConfigService
  ) {
    this.logger = new Logger('WalletService')
    const privateKey = configService.get<string>('operatorWallet.privateKey');
    this.#operatorWallet = new Wallet(privateKey, currentProvider)
    this.logger.verbose(`Operator Wallet is ${this.#operatorWallet.address}`)
  }

  static unlockWallet(
    encryptedWallet: string,
    password: string,
  ): Promise<Wallet> {
    return Wallet.fromEncryptedJson(encryptedWallet, password);
  }

  async createWalletFor(id: number, encryptPasswd: string): Promise<void> {
    const matchedWallet = await this.walletAccountRepo.findOne(id);

    if (matchedWallet) {
      throw new ConflictException('You already have a wallet.');
    }

    const _newHostingWallet = Wallet.createRandom();
    const keystore = await _newHostingWallet.encrypt(encryptPasswd);
    await this.walletAccountRepo.save({
      id,
      address: _newHostingWallet.address,
      keystore,
      nonce: 0,
    });
  }

  async useNonceOf(
    address: string,
  ): Promise<{ currentNonce: number; nextNonce: number }> {
    const account = await this.walletAccountRepo.findOne({
      address,
    });
    if (!account) throw new NotFoundException('Wallet Not found');
    const currentNonce = account.nonce;
    const nextNonce = currentNonce + 1;
    await this.walletAccountRepo.update(account.id, { nonce: nextNonce });
    return { currentNonce, nextNonce };
  }

  async handleTokenIssueRequest(tokensNeedToDeploy: Token[]): Promise<void> {
    // anti fool design
    // PENDING = not sent yet
    const notPendingTokens = tokensNeedToDeploy.filter(t => t.status !== TransactionStatus.PENDING);
    if (notPendingTokens.length > 0) {
      this.logger.verbose(`Not Pending Token Ids: ${notPendingTokens.map(t => t.id).join(', ')}`)
      throw new Error("handleTokenIssueRequest only receives PENDING tokens. ");
    }

    // @todo: use Multicall to handle them all


    // @todo: update their status to `TransactionStatus.SENDING` with TxHash
    
  }
}
