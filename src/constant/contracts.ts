import { ChainId, currentChainId } from '.';

export const CONTRACTS: {
  [chainId in ChainId]?: {
    [contractName: string]: string;
    Registry: string;
    Factory: string;
    ClearingHouse: string;
  };
} = {
  // @todo: 填空你在主网部署的两个合约
  [ChainId.MAINNET]: {
    Registry: '0x0000000000000000000000000000000000000000',
    Factory: '0x0000000000000000000000000000000000000000',
    ClearingHouse: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.BSC_TESTNET]: {
    Registry: '0x8B474f0436E510FF81214C72D7aA9ede1e489164',
    Factory: '0xA61F078bf69DdF7B9C7799cDfC18216cEB2Fff0b',
    ClearingHouse: '0xDCEF98bC7EFBD6791b3720464b15E3e23aF1045E',
  },
  [ChainId.BSC_MAINNET]: {
    Registry: '0x0000000000000000000000000000000000000000',
    Factory: '0x0000000000000000000000000000000000000000',
    ClearingHouse: '0x0000000000000000000000000000000000000000',
  },
};

export const currentContracts = CONTRACTS[currentChainId];
