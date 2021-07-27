import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'ethers';
import { Logger } from '@nestjs/common';
import { Account } from 'src/entities/Account';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  logger: Logger;
  constructor(
    @InjectRepository(Account)
    private readonly walletAccountRepo: Repository<Account>,
  ) {}

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
}
