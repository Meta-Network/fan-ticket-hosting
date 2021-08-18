export interface StandardTokenProfile {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface StandardTokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags?: Record<string, any>;
  logoURI: string;
  keywords: string[];
  tokens: Array<StandardTokenProfile>;
}
