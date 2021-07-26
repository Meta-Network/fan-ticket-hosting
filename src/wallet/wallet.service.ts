import { Injectable } from '@nestjs/common';
import { Wallet } from 'ethers';

@Injectable()
export class WalletService {
    static generateWalletWithPassword(password: string): Promise<string> {
        const wallet = Wallet.createRandom()
        return wallet.encrypt(password)
    }

    static unlockWallet(encryptedWallet: string, password: string): Promise<Wallet> {
        return Wallet.fromEncryptedJson(encryptedWallet, password);
    }
}
