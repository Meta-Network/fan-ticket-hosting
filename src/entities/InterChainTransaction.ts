import { TransactionStatus } from '../types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InterChainToken } from './InterChainToken';
import { Account } from './Account';
import { OutTransaction } from './OutTransaction';

export enum InterChainTransactionType {
  BURN = 'burn', // External chain => Original chain
  MINT = 'mint', // Original Chain => External chain
}

@Entity()
export class InterChainTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  tokenId: number;

  @ManyToOne(
    () => InterChainToken,
    t => t.transactions,
    { nullable: false },
  )
  token: InterChainToken;

  @ManyToOne(
    () => Account,
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
    enum: InterChainTransactionType,
    nullable: false,
  })
  type: InterChainTransactionType;

  @Column({
    type: 'varchar',
    length: 78,
  })
  value: string;

  @OneToOne(() => OutTransaction)
  @JoinColumn()
  relatedTx: OutTransaction;

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
