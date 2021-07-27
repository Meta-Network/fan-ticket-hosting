import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Transaction,
} from 'typeorm';
import { Token } from './Token';
import { OutTransaction } from './OutTransaction';

@Entity()
export class Account {
  // Use UCenter user id as this ID
  @PrimaryColumn()
  id: number;

  @Column({ type: 'char', length: 42 })
  address: string;

  @Column({ type: 'text' })
  keystore: string;

  @Column({
    default: 0,
    nullable: false,
  })
  nonce: number;

  @OneToOne(
    () => Token,
    t => t.owner,
  )
  issuedToken: Token;

  @OneToMany(
    () => OutTransaction,
    t => t.from,
  )
  sentTransactions: OutTransaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
