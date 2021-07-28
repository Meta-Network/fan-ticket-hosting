import { BigNumberish } from 'ethers';
import { TxType } from 'src/types/contracts/FanTicketClearingHouse';

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
