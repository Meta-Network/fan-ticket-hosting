import { ChainId, currentChainId } from '.';

export const CONTRACTS: {
  [chainId in ChainId]?: {
    [contractName: string]: string;
    MARKET: string;
    MEDIA: string;
  };
} = {
  // @todo: 填空你在主网部署的两个合约
  [ChainId.MAINNET]: {
    MARKET: '0x0000000000000000000000000000000000000000',
    MEDIA: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.BSC_TESTNET]: {
    MARKET: '0xAa9a113D8a8a62962578BFf1Be9dAB70336971B5',
    MEDIA: '0x520B66a0fEC5335Aba9f34774AAE8bfc2C27d234',
  },
  [ChainId.BSC_MAINNET]: {
    MARKET: '0x456bd9F5e006A27ec446DC2978e025590703823C',
    MEDIA: '0x75CB5AB6778454644cB6b0149c59dE99303fcaDf',
  },
};

export const currentContracts = CONTRACTS[currentChainId];
