import { TransactionStatus } from '../types';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InterChainToken } from './InterChainToken';
import { Token } from './Token';

@Entity()
export class InterChainInTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  icTokenId: number;

  @ManyToOne(
    () => InterChainToken,
    { nullable: false },
  )
  icToken: InterChainToken;

  @Column({ nullable: false })
  tokenId: number;

  @ManyToOne(
    () => Token,
    { nullable: false },
  )
  token: Token;

  // `from` should be the burner itself
  @Column({
    type: 'char',
    length: 42,
  })
  from: string;

  // `to` should be the `burn(to, val)`'s `to`
  @Column({
    type: 'char',
    length: 42,
  })
  to: string;

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
    nullable: true
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
