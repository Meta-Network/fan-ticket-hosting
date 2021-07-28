import { BigNumberish } from 'ethers';

export enum TxType {
  Transfer = 0,
  Mint = 1,
  Permit = 2
}

export type TransferOrder = {
  token: string;
  from: string;
  to: string;
  value: BigNumberish;
  _type: TxType.Transfer;
  deadline: number;
  v: number;
  r: string;
  s: string;
};

export type MintOrder = {
  token: string;
  from: string;
  to: string;
  value: BigNumberish;
  _type: TxType.Mint;
  deadline: number;
  v: number;
  r: string;
  s: string;
};

export type ApproveOrder = {
  token: string;
  from: string;
  to: string;
  value: BigNumberish;
  _type: TxType.Permit;
  deadline: number;
  v: number;
  r: string;
  s: string;
};

export type TransactionOrder = TransferOrder | MintOrder;

export type CreationPermit = {
  name: string;
  symbol: string;
  owner: string;
  tokenId: BigNumberish;
  initialSupply: BigNumberish;
  v: number;
  r: string;
  s: string;
};
