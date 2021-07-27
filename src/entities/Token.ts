import { TransactionStatus } from '../types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Account } from './Account';
import { OutTransaction } from './OutTransaction';

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
    nullable: true,
  })
  txHash: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @OneToMany(
    () => OutTransaction,
    t => t.token,
  )
  transactions: OutTransaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
