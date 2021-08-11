import { TransactionStatus } from '../types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from './Token';
import { Account } from './Account';

export enum TransactionType {
  TRANSFER = 'transfer', // use `transferFromBySig()`
  MINT = 'mint', // use `mintBySig()`
  APPROVE = 'approve', // use `permit()`,
  // Interchain Parking related TX
  INTERCHAIN_DEPOSIT = 'ic_deposit', 
  INTERCHAIN_WITHDRAW = "ic_withdraw"
}

@Entity()
export class OutTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  tokenId: number;

  @ManyToOne(
    () => Token,
    t => t.transactions,
    { nullable: false },
  )
  token: Token;

  @ManyToOne(
    () => Account,
    acc => acc.sentTransactions,
    { nullable: false },
  )
  from: Account;

  // `to` can be anything, as long it's an eth address
  @Column({
    type: 'char',
    length: 42,
  })
  to: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @Column({
    type: 'varchar',
    length: 78,
  })
  value: string;

  /**
   * Signature Related
   * We are using them to
   * batch all those meta transaction in the clearing house contract
   */
  @Column()
  deadline: number;

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
