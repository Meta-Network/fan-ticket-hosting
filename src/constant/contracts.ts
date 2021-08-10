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
    Registry: "0x30444fBE67E7292EaBafBc970537dAF5D0b0F2C7",
    Factory: "0xeB6aD1485ED16497082123b6d4213A129B6e16D2",
    ClearingHouse: "0x5ECc9dB489E94a3907FfDC3bC70f33C824af73DE"
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

type InterChainContractsList = Partial<
  Record<ChainId, {
    Registry: string;
    Factory: string;
  }>
>;

export const InterChainContracts: InterChainContractsList = {
  [ChainId.RINKEBY]: {
    Registry: '0x26067a46f642Aa6571dA34888f8fa030Dbb471DB',
    Factory: '0x0726F63Eb67a2AF09507cE109308D762d18BEd42'
  }
};

export const currentContracts = CONTRACTS[currentChainId];
export const currentMulticall = MULTICALL_NETWORKS[currentChainId];
