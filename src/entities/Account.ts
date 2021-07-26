import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
