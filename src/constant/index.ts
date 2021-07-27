import configuration from '../config/configuration';

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  HECO_MAINNET = 128,
  HECO_TESTNET = 256,
  MATIC_MAINNET = 137,
  OKCHAIN_TEST = 65,
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const currentChainId = (configuration().app.chainId || 97) as ChainId;
console.info(`Running On ChainId: ${currentChainId}`);
