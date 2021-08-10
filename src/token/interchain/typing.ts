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

export type InterChainCreationPermit = {
  originAddress: string;
  name: string;
  symbol: string;
  tokenId: BigNumberish;
  originChainId: BigNumberish;
  v: BigNumberish;
  r: string;
  s: string;
};

