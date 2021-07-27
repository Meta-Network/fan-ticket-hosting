import { ethers } from 'ethers';
import { ChainId, currentChainId } from './index';

export const providers: {
  [chainId in ChainId]?: ethers.providers.Provider;
} = {
  [ChainId.BSC_TESTNET]: new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-2-s2.binance.org:8545/',
  ),
  [ChainId.BSC_MAINNET]: new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/',
  ),
  // @todo: uncomment when go mainnet
  // [ChainId.MAINNET]: new ethers.providers.AlchemyProvider(
  //     'homestead',
  //     process.env.ALCHEMY_APIKEY,
  // ),
  //   [ChainId.KOVAN]: new ethers.providers.AlchemyProvider(
  //     'kovan',
  //     process.env.ALCHEMY_APIKEY,
  //   ),
  // [ChainId.RINKEBY]: new ethers.providers.AlchemyProvider(
  //     'rinkeby',
  //     process.env.ALCHEMY_APIKEY,
  // ),
  //   [ChainId.GÖRLI]: new ethers.providers.AlchemyProvider(
  //     'gorli',
  //     process.env.ALCHEMY_APIKEY,
  //   ),
};
export const currentProvider = providers[currentChainId];
