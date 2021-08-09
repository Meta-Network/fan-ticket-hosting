import { TransactionStatus } from '../types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Token } from "./Token";
import { InterChainTransaction } from './InterChainTransaction';

@Entity()
export class InterChainToken {
  @PrimaryGeneratedColumn()
  id: number;

  // the original token
  @ManyToOne(() => Token, t => t.interchainTokens)
  origin: Token;

  @Column()
  originId: number;

  // @todo: origin + chainId should be unique
  @Column()
  chainId: number;

  @Column({ type: 'char', length: 42 })
  address: string;

  /**
   * Signature Related
   * Let the user interact with these sig
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
   * Marking the creation's on-chain status
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
    () => InterChainTransaction,
    t => t.token,
  )
  transactions: InterChainTransaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
