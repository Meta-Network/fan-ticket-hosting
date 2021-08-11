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
    Parking: string;
  };
} = {
  // @todo: 填空你在主网部署的两个合约
  [ChainId.MAINNET]: {
    Registry: '0x0000000000000000000000000000000000000000',
    Factory: '0x0000000000000000000000000000000000000000',
    ClearingHouse: '0x0000000000000000000000000000000000000000',
    Parking: '0x0000000000000000000000000000000000000000'
  },
  [ChainId.BSC_TESTNET]: {
    Registry: "0x30444fBE67E7292EaBafBc970537dAF5D0b0F2C7",
    Factory: "0xeB6aD1485ED16497082123b6d4213A129B6e16D2",
    ClearingHouse: "0xBCEAd2cbb92De10ca9609A051A965A1FBB4987F4",
    Parking: '0xC0F2C0843edb2Fa66Bc498463D9d2Dd93d5EeEae'
  },
  [ChainId.BSC_MAINNET]: {
    Registry: '0x0000000000000000000000000000000000000000',
    Factory: '0x0000000000000000000000000000000000000000',
    ClearingHouse: '0x0000000000000000000000000000000000000000',
    Parking: '0x0000000000000000000000000000000000000000'
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
    "Registry": "0xCd860fc97cDe1B3fD8fc407EAeC4E4962E34FCD9",
    "Factory": "0xdc0cC9692dCD74D7fE018305Ce6D3a87C225700F"
  }
};

export const currentContracts = CONTRACTS[currentChainId];
export const currentMulticall = MULTICALL_NETWORKS[currentChainId];
