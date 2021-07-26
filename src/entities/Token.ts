import { TransactionStatus } from '../types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Token Profile
   */
  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  totalSupply: string;

  @OneToOne(
    () => Account,
    acc => acc.issuedToken,
  )
  @JoinColumn()
  owner: Account;

  @Column({ type: 'char', length: 42 })
  address: string;

  /**
   * Signature Related
   * Trying them to batch all those
   * creation in Multicall contract
   */
  @Column()
  v: number;

  // bytes32 hash string is 64 chars long, with '0x' prefix is 66.
  @Column({
    type: 'char',
    length: 66,
  })
  r: string;

  @Column({
    type: 'char',
    length: 66,
  })
  s: string;

  /**
   * Marking the transaction's on-chain status
   */
  @Column({
    type: 'varchar',
    length: 255,
  })
  txHash: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
