/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MetaNetworkRoleRegistry,
  MetaNetworkRoleRegistryInterface,
} from "../MetaNetworkRoleRegistry";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "datetime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "list",
        type: "address[]",
      },
    ],
    name: "Delist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "datetime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "list",
        type: "address[]",
      },
    ],
    name: "Enlist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "HandoverAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NETWORK_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "list",
        type: "address[]",
      },
    ],
    name: "delistPeoplesInBanList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "list",
        type: "address[]",
      },
    ],
    name: "enlistPeoplesInBanList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isInBlacklist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061003b7ff109839dd0a4a9f4c4954a0153b969c7cda2a8844a0bc6ea490df268017835b733610040565b6100ec565b61004a828261004e565b5050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1661004a576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556100a83390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6110c4806100fb6000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c80637188cb7011610081578063a217fddf1161005b578063a217fddf146101f0578063b4661401146101f8578063d547741f1461020b57600080fd5b80637188cb701461016257806391d14854146101895780639caf9b00146101cd57600080fd5b8063248a9ca3116100b2578063248a9ca31461010b5780632f2ff15d1461013c57806336568abe1461014f57600080fd5b806301ffc9a7146100ce57806323b9eb59146100f6575b600080fd5b6100e16100dc366004610dea565b61021e565b60405190151581526020015b60405180910390f35b610109610104366004610cc2565b6102b7565b005b61012e610119366004610da7565b60009081526020819052604090206001015490565b6040519081526020016100ed565b61010961014a366004610dbf565b61045d565b61010961015d366004610dbf565b610488565b61012e7ff109839dd0a4a9f4c4954a0153b969c7cda2a8844a0bc6ea490df268017835b781565b6100e1610197366004610dbf565b60009182526020828152604080842073ffffffffffffffffffffffffffffffffffffffff93909316845291905290205460ff1690565b6100e16101db366004610ca8565b60016020526000908152604090205460ff1681565b61012e600081565b610109610206366004610cc2565b61053b565b610109610219366004610dbf565b6106d5565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b0000000000000000000000000000000000000000000000000000000014806102b157507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b3360009081527fc95bc0a7fc97351f724679a24d27e3f0d032f92a5805b4b71127cff2d5908a65602052604090205460ff16610354576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f596f75277265206e6f74207468652061646d696e00000000000000000000000060448201526064015b60405180910390fd5b60005b81518160ff16101561040a576000828260ff16815181106103a1577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60209081029190910181015173ffffffffffffffffffffffffffffffffffffffff16600090815260019091526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055508061040281611010565b915050610357565b50423373ffffffffffffffffffffffffffffffffffffffff167f3e96a46d14fb14d10c3669f3d892d45135eae8ac524b33143e28bed19b49f1f8836040516104529190610eab565b60405180910390a350565b60008281526020819052604090206001015461047981336106fb565b61048383836107cb565b505050565b73ffffffffffffffffffffffffffffffffffffffff8116331461052d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c660000000000000000000000000000000000606482015260840161034b565b61053782826108bb565b5050565b3360009081527fc95bc0a7fc97351f724679a24d27e3f0d032f92a5805b4b71127cff2d5908a65602052604090205460ff166105d3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f596f75277265206e6f74207468652061646d696e000000000000000000000000604482015260640161034b565b60005b81518160ff16101561068d576000828260ff1681518110610620577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60209081029190910181015173ffffffffffffffffffffffffffffffffffffffff1660009081526001918290526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169091179055508061068581611010565b9150506105d6565b50423373ffffffffffffffffffffffffffffffffffffffff167fad7a1a9809e02570a7d560d5cddfd73f3940ec906c0da19c3e139bd01fc06852836040516104529190610eab565b6000828152602081905260409020600101546106f181336106fb565b61048383836108bb565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16610537576107518173ffffffffffffffffffffffffffffffffffffffff166014610972565b61075c836020610972565b60405160200161076d929190610e2a565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152908290527f08c379a000000000000000000000000000000000000000000000000000000000825261034b91600401610f05565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff166105375760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff85168452909152902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600117905561085d3390565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16156105375760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516808552925280832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60606000610981836002610f6e565b61098c906002610f56565b67ffffffffffffffff8111156109cb577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156109f5576020820181803683370190505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110610a53577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110610add577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053506000610b19846002610f6e565b610b24906001610f56565b90505b6001811115610c0f577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110610b8c577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b1a60f81b828281518110610bc9577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c93610c0881610fdb565b9050610b27565b508315610c78576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161034b565b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610ca357600080fd5b919050565b600060208284031215610cb9578081fd5b610c7882610c7f565b60006020808385031215610cd4578182fd5b823567ffffffffffffffff80821115610ceb578384fd5b818501915085601f830112610cfe578384fd5b813581811115610d1057610d1061105f565b8060051b6040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0603f83011681018181108582111715610d5357610d5361105f565b604052828152858101935084860182860187018a1015610d71578788fd5b8795505b83861015610d9a57610d8681610c7f565b855260019590950194938601938601610d75565b5098975050505050505050565b600060208284031215610db8578081fd5b5035919050565b60008060408385031215610dd1578081fd5b82359150610de160208401610c7f565b90509250929050565b600060208284031215610dfb578081fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114610c78578182fd5b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610e62816017850160208801610fab565b7f206973206d697373696e6720726f6c65200000000000000000000000000000006017918401918201528351610e9f816028840160208801610fab565b01602801949350505050565b6020808252825182820181905260009190848201906040850190845b81811015610ef957835173ffffffffffffffffffffffffffffffffffffffff1683529284019291840191600101610ec7565b50909695505050505050565b6020815260008251806020840152610f24816040850160208701610fab565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b60008219821115610f6957610f69611030565b500190565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610fa657610fa6611030565b500290565b60005b83811015610fc6578181015183820152602001610fae565b83811115610fd5576000848401525b50505050565b600081610fea57610fea611030565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b600060ff821660ff81141561102757611027611030565b60010192915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea264697066735822122092cbdf7b959cd237f330d48b5dff39d7af6fef885836f912c0d8e0590d5987e864736f6c63430008040033";

export class MetaNetworkRoleRegistry__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MetaNetworkRoleRegistry> {
    return super.deploy(overrides || {}) as Promise<MetaNetworkRoleRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MetaNetworkRoleRegistry {
    return super.attach(address) as MetaNetworkRoleRegistry;
  }
  connect(signer: Signer): MetaNetworkRoleRegistry__factory {
    return super.connect(signer) as MetaNetworkRoleRegistry__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MetaNetworkRoleRegistryInterface {
    return new utils.Interface(_abi) as MetaNetworkRoleRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MetaNetworkRoleRegistry {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MetaNetworkRoleRegistry;
  }
}
