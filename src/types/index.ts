export class GeneralResponse<T = Record<string, any>> {
  code: number;
  data: T;
  message?: string;
}

export enum TransactionStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  SUCCESS = 'success',
  REVERTED = 'reverted',
}
