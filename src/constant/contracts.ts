import { ChainId, currentChainId } from '.';

export type AddressBookForNetwork = {
  [chainId in ChainId]: string;
};

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

export const MULTICALL_NETWORKS: AddressBookForNetwork = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.BSC_MAINNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.BSC_TESTNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
};

export const currentContracts = CONTRACTS[currentChainId];
export const currentMulticall = MULTICALL_NETWORKS[currentChainId];
