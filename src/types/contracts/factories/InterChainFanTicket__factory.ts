/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  InterChainFanTicket,
  InterChainFanTicketInterface,
} from "../InterChainFanTicket";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "burntToTarget",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "InterChainFanTicketBurnt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "InterChainFanTicketMint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
    inputs: [],
    name: "_BURN_PERMIT_TYPEHASH",
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
    name: "_MINT_PERMIT_TYPEHASH",
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
    name: "_TRANFER_TYPEHASH",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "burnBySig",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_managerRegistry",
        type: "address",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "managerRegistry",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "mintBySig",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "mintNonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "transferFromBySig",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101406040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9610120526006805460ff60a01b191690553480156200004457600080fd5b50604051620025a5380380620025a58339810160408190526200006791620002b7565b8180604051806040016040528060018152602001603160f81b815250848481600390805190602001906200009d9291906200015e565b508051620000b39060049060208401906200015e565b5050825160208085019190912083518483012060c082815260e08290524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301889052606082018790526080820194909452308184015281518082039093018352909301909252815191909401209193509190608052610100525050600680546001600160a01b0319163317905550620003719350505050565b8280546200016c906200031e565b90600052602060002090601f016020900481019282620001905760008555620001db565b82601f10620001ab57805160ff1916838001178555620001db565b82800160010185558215620001db579182015b82811115620001db578251825591602001919060010190620001be565b50620001e9929150620001ed565b5090565b5b80821115620001e95760008155600101620001ee565b600082601f83011262000215578081fd5b81516001600160401b03808211156200023257620002326200035b565b604051601f8301601f19908116603f011681019082821181831017156200025d576200025d6200035b565b8160405283815260209250868385880101111562000279578485fd5b8491505b838210156200029c57858201830151818301840152908201906200027d565b83821115620002ad57848385830101525b9695505050505050565b60008060408385031215620002ca578182fd5b82516001600160401b0380821115620002e1578384fd5b620002ef8683870162000204565b9350602085015191508082111562000305578283fd5b50620003148582860162000204565b9150509250929050565b600181811c908216806200033357607f821691505b602082108114156200035557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160a05160c05160e05161010051610120516121e4620003c16000396000610fda0152600061184f0152600061189e01526000611879015260006117fd0152600061182601526121e46000f3fe608060405234801561001057600080fd5b50600436106101b95760003560e01c806370a08231116100f95780639dc29fac11610097578063c45a015511610071578063c45a01551461042b578063d505accf1461044b578063dd62ed3e1461045e578063f7e31490146104a457600080fd5b80639dc29fac146103f2578063a457c2d714610405578063a9059cbb1461041857600080fd5b80637ecebe00116100d35780637ecebe00146103905780638245c183146103a35780639540bce8146103ca57806395d89b41146103ea57600080fd5b806370a08231146103205780637188cb7014610356578063752702751461037d57600080fd5b806323b872dd11610166578063395093511161014057806339509351146102c057806340c10f19146102d3578063554d67db146102e657806368410888146102f957600080fd5b806323b872dd14610296578063313ce567146102a95780633644e515146102b857600080fd5b80631585269011610197578063158526901461024457806318160ddd1461027957806319ab453c1461028157600080fd5b806306fdde03146101be578063095ea7b3146101dc5780630f9d1d92146101ff575b600080fd5b6101c66104b7565b6040516101d39190612058565b60405180910390f35b6101ef6101ea36600461200f565b610549565b60405190151581526020016101d3565b60085461021f9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101d3565b61026b7fcfd376b06cae7d4f054a20964bf42cf8226fdd38a5bc91ed5f56b52f482e9aed81565b6040519081526020016101d3565b60025461026b565b61029461028f366004611f10565b61055f565b005b6101ef6102a4366004611f63565b6106d7565b604051601281526020016101d3565b61026b6107bd565b6101ef6102ce36600461200f565b6107cc565b6102946102e136600461200f565b610815565b6101ef6102f4366004611f9e565b61089d565b61026b7feadc949c56da225ec46b6a046692f3e0896dd71c42a65e1d1998818a944086b381565b61026b61032e366004611f10565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b61026b7ff109839dd0a4a9f4c4954a0153b969c7cda2a8844a0bc6ea490df268017835b781565b6101ef61038b366004611f9e565b610ab1565b61026b61039e366004611f10565b610de5565b61026b7fdd2f6f840cc9148db889609f1fab3c05b7a99fb969db7d8ac3c5d201c76acc3181565b61026b6103d8366004611f10565b60076020526000908152604090205481565b6101c6610e12565b6101ef61040036600461200f565b610e21565b6101ef61041336600461200f565b610e87565b6101ef61042636600461200f565b610f5f565b60065461021f9073ffffffffffffffffffffffffffffffffffffffff1681565b610294610459366004611f9e565b610f6c565b61026b61046c366004611f31565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b6101ef6104b2366004611f9e565b61112b565b6060600380546104c6906120f8565b80601f01602080910402602001604051908101604052809291908181526020018280546104f2906120f8565b801561053f5780601f106105145761010080835404028352916020019161053f565b820191906000526020600020905b81548152906001019060200180831161052257829003601f168201915b5050505050905090565b6000610556338484611391565b50600192915050565b60065474010000000000000000000000000000000000000000900460ff16156105e9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f696e69743a20616c726561647920696e697469616c697a65640000000000000060448201526064015b60405180910390fd5b60065473ffffffffffffffffffffffffffffffffffffffff163314610690576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f496e69742073686f756c642062652063616c6c65642066726f6d20666163746f60448201527f727920636f6e74726163742e000000000000000000000000000000000000000060648201526084016105e0565b600880547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b60006106e4848484611545565b73ffffffffffffffffffffffffffffffffffffffff84166000908152600160209081526040808320338452909152902054828110156107a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201527f6c6c6f77616e636500000000000000000000000000000000000000000000000060648201526084016105e0565b6107b28533858403611391565b506001949350505050565b60006107c76117f9565b905090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490916105569185906108109086906120c9565b611391565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f44697361626c656420646972656374206d696e7420666f7220496e746572436860448201527f61696e46616e5469636b6574000000000000000000000000000000000000000060648201526084016105e0565b60008480421115610930576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f45524332305065726d69743a3a7369676e61747572652065787069726564206460448201527f6561646c696e650000000000000000000000000000000000000000000000000060648201526084016105e0565b60007feadc949c56da225ec46b6a046692f3e0896dd71c42a65e1d1998818a944086b38a8a8a61095f8e6118ec565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810188905260e00160405160208183030381529060405280519060200120905060006109c782611921565b905060006109d78289898961198a565b90508b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a94576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f45524332305065726d69743a3a7472616e7366657246726f6d3a20696e76616c60448201527f6964207369676e6174757265000000000000000000000000000000000000000060648201526084016105e0565b610a9f8c8c8c611545565b5060019b9a5050505050505050505050565b60008480421115610b44576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f45524332305065726d69743a3a7369676e61747572652065787069726564206460448201527f6561646c696e650000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff8816600090815260076020526040812080547fdd2f6f840cc9148db889609f1fab3c05b7a99fb969db7d8ac3c5d201c76acc31918c918c918c919086610b9e83612146565b9091555060408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810188905260e0016040516020818303038152906040528051906020012090506000610c0a82611921565b90506000610c1a8289898961198a565b6008546040517f91d148540000000000000000000000000000000000000000000000000000000081527ff109839dd0a4a9f4c4954a0153b969c7cda2a8844a0bc6ea490df268017835b7600482015273ffffffffffffffffffffffffffffffffffffffff8084166024830152929350600092909116906391d148549060440160206040518083038186803b158015610cb157600080fd5b505afa158015610cc5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ce99190612038565b905080610d78576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e746572436861696e46616e5469636b65743a3a6d696e743a207369676e6560448201527f72206973206e6f742061646d696e00000000000000000000000000000000000060648201526084016105e0565b610d828c8c611be2565b8b73ffffffffffffffffffffffffffffffffffffffff167fbd1283de19dfc808ca4d009f119027442205acf0c57c8137615992b6b3bd5d9e8c604051610dca91815260200190565b60405180910390a25060019c9b505050505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600560205260408120545b92915050565b6060600480546104c6906120f8565b6000610e2d3383611d02565b6040805173ffffffffffffffffffffffffffffffffffffffff851681526020810184905233917f7e4a0f24aeee0932822bb3073a513383ad6d3654e7af60de08f85a9b8a02d5cb910160405180910390a250600192915050565b33600090815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8616845290915281205482811015610f48576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016105e0565b610f553385858403611391565b5060019392505050565b6000610556338484611545565b83421115610fd6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e6500000060448201526064016105e0565b60007f00000000000000000000000000000000000000000000000000000000000000008888886110058c6118ec565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061106d82611921565b9050600061107d8287878761198a565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611114576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e6174757265000060448201526064016105e0565b61111f8a8a8a611391565b50505050505050505050565b600084804211156111be576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f45524332305065726d69743a3a7369676e61747572652065787069726564206460448201527f6561646c696e650000000000000000000000000000000000000000000000000060648201526084016105e0565b60007fcfd376b06cae7d4f054a20964bf42cf8226fdd38a5bc91ed5f56b52f482e9aed8a8a8a6111ed8e6118ec565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810188905260e001604051602081830303815290604052805190602001209050600061125582611921565b905060006112658289898961198a565b90508b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611322576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f496e746572436861696e46616e5069616f3a3a6275726e42795369673a20696e60448201527f76616c6964207369676e6174757265000000000000000000000000000000000060648201526084016105e0565b61132c8c8b611d02565b6040805173ffffffffffffffffffffffffffffffffffffffff8d81168252602082018d90528e16917f7e4a0f24aeee0932822bb3073a513383ad6d3654e7af60de08f85a9b8a02d5cb910160405180910390a25060019b9a5050505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8316611433576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff82166114d6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff83166115e8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff821661168b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015611741576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082208585039055918516815290812080548492906117859084906120c9565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516117eb91815260200190565b60405180910390a350505050565b60007f000000000000000000000000000000000000000000000000000000000000000046141561184857507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b73ffffffffffffffffffffffffffffffffffffffff811660009081526005602052604090208054600181018255905b50919050565b6000610e0c61192e6117f9565b836040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0821115611a3c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f756500000000000000000000000000000000000000000000000000000000000060648201526084016105e0565b8360ff16601b1480611a5157508360ff16601c145b611add576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c60448201527f756500000000000000000000000000000000000000000000000000000000000060648201526084016105e0565b6040805160008082526020820180845288905260ff871692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa158015611b31573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116611bd9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016105e0565b95945050505050565b73ffffffffffffffffffffffffffffffffffffffff8216611c5f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105e0565b8060026000828254611c7191906120c9565b909155505073ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604081208054839290611cab9084906120c9565b909155505060405181815273ffffffffffffffffffffffffffffffffffffffff8316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff8216611da5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f730000000000000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015611e5b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f636500000000000000000000000000000000000000000000000000000000000060648201526084016105e0565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120838303905560028054849290611e979084906120e1565b909155505060405182815260009073ffffffffffffffffffffffffffffffffffffffff8516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001611538565b803573ffffffffffffffffffffffffffffffffffffffff81168114611f0b57600080fd5b919050565b600060208284031215611f21578081fd5b611f2a82611ee7565b9392505050565b60008060408385031215611f43578081fd5b611f4c83611ee7565b9150611f5a60208401611ee7565b90509250929050565b600080600060608486031215611f77578081fd5b611f8084611ee7565b9250611f8e60208501611ee7565b9150604084013590509250925092565b600080600080600080600060e0888a031215611fb8578283fd5b611fc188611ee7565b9650611fcf60208901611ee7565b95506040880135945060608801359350608088013560ff81168114611ff2578384fd5b9699959850939692959460a0840135945060c09093013592915050565b60008060408385031215612021578182fd5b61202a83611ee7565b946020939093013593505050565b600060208284031215612049578081fd5b81518015158114611f2a578182fd5b6000602080835283518082850152825b8181101561208457858101830151858201604001528201612068565b818111156120955783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b600082198211156120dc576120dc61217f565b500190565b6000828210156120f3576120f361217f565b500390565b600181811c9082168061210c57607f821691505b6020821081141561191b577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156121785761217861217f565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea26469706673582212201b75b8844883d4319d949c5289991d5c34b09b639ce4ba684b0bfbe216c480b564736f6c63430008040033";

export class InterChainFanTicket__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<InterChainFanTicket> {
    return super.deploy(
      name,
      symbol,
      overrides || {}
    ) as Promise<InterChainFanTicket>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): InterChainFanTicket {
    return super.attach(address) as InterChainFanTicket;
  }
  connect(signer: Signer): InterChainFanTicket__factory {
    return super.connect(signer) as InterChainFanTicket__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InterChainFanTicketInterface {
    return new utils.Interface(_abi) as InterChainFanTicketInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InterChainFanTicket {
    return new Contract(address, _abi, signerOrProvider) as InterChainFanTicket;
  }
}
