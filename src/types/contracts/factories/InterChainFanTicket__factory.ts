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
        name: "from",
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
  "0x6101406040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9610120526006805460ff60a01b191690553480156200004457600080fd5b50604051620024e3380380620024e38339810160408190526200006791620002b7565b8180604051806040016040528060018152602001603160f81b815250848481600390805190602001906200009d9291906200015e565b508051620000b39060049060208401906200015e565b5050825160208085019190912083518483012060c082815260e08290524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301889052606082018790526080820194909452308184015281518082039093018352909301909252815191909401209193509190608052610100525050600680546001600160a01b0319163317905550620003719350505050565b8280546200016c906200031e565b90600052602060002090601f016020900481019282620001905760008555620001db565b82601f10620001ab57805160ff1916838001178555620001db565b82800160010185558215620001db579182015b82811115620001db578251825591602001919060010190620001be565b50620001e9929150620001ed565b5090565b5b80821115620001e95760008155600101620001ee565b600082601f83011262000215578081fd5b81516001600160401b03808211156200023257620002326200035b565b604051601f8301601f19908116603f011681019082821181831017156200025d576200025d6200035b565b8160405283815260209250868385880101111562000279578485fd5b8491505b838210156200029c57858201830151818301840152908201906200027d565b83821115620002ad57848385830101525b9695505050505050565b60008060408385031215620002ca578182fd5b82516001600160401b0380821115620002e1578384fd5b620002ef8683870162000204565b9350602085015191508082111562000305578283fd5b50620003148582860162000204565b9150509250929050565b600181811c908216806200033357607f821691505b602082108114156200035557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160a05160c05160e0516101005161012051612122620003c1600039600061115701526000611766015260006117b501526000611790015260006117140152600061173d01526121226000f3fe608060405234801561001057600080fd5b50600436106101a35760003560e01c806368410888116100ee57806395d89b4111610097578063bfa9c78311610071578063bfa9c783146103e2578063c45a0155146103f5578063d505accf14610415578063dd62ed3e1461042857600080fd5b806395d89b41146103b4578063a457c2d7146103bc578063a9059cbb146103cf57600080fd5b806375270275116100c857806375270275146103675780637ecebe001461037a5780638245c1831461038d57600080fd5b806368410888146102e357806370a082311461030a5780637188cb701461034057600080fd5b806323b872dd11610150578063395093511161012a57806339509351146102aa57806340c10f19146102bd578063554d67db146102d057600080fd5b806323b872dd14610280578063313ce567146102935780633644e515146102a257600080fd5b80631585269011610181578063158526901461022e57806318160ddd1461026357806319ab453c1461026b57600080fd5b806306fdde03146101a8578063095ea7b3146101c65780630f9d1d92146101e9575b600080fd5b6101b061046e565b6040516101bd9190611fcf565b60405180910390f35b6101d96101d4366004611f2f565b610500565b60405190151581526020016101bd565b6007546102099073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101bd565b6102557f897f667f5409d7c551cd2e1f25be8df1820aed12a4fb1d24d530a59ba5205fb681565b6040519081526020016101bd565b600254610255565b61027e610279366004611e38565b610516565b005b6101d961028e366004611e8b565b61068e565b604051601281526020016101bd565b610255610774565b6101d96102b8366004611f2f565b610783565b61027e6102cb366004611f2f565b6107cc565b6101d96102de366004611ec6565b610854565b6102557feadc949c56da225ec46b6a046692f3e0896dd71c42a65e1d1998818a944086b381565b610255610318366004611e38565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6102557ff109839dd0a4a9f4c4954a0153b969c7cda2a8844a0bc6ea490df268017835b781565b6101d9610375366004611ec6565b610a68565b610255610388366004611e38565b610d6d565b6102557fdd2f6f840cc9148db889609f1fab3c05b7a99fb969db7d8ac3c5d201c76acc3181565b6101b0610d9a565b6101d96103ca366004611f2f565b610da9565b6101d96103dd366004611f2f565b610e81565b6101d96103f0366004611f58565b610e8e565b6006546102099073ffffffffffffffffffffffffffffffffffffffff1681565b61027e610423366004611ec6565b6110e9565b610255610436366004611e59565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461047d9061206f565b80601f01602080910402602001604051908101604052809291908181526020018280546104a99061206f565b80156104f65780601f106104cb576101008083540402835291602001916104f6565b820191906000526020600020905b8154815290600101906020018083116104d957829003601f168201915b5050505050905090565b600061050d3384846112a8565b50600192915050565b60065474010000000000000000000000000000000000000000900460ff16156105a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f696e69743a20616c726561647920696e697469616c697a65640000000000000060448201526064015b60405180910390fd5b60065473ffffffffffffffffffffffffffffffffffffffff163314610647576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f496e69742073686f756c642062652063616c6c65642066726f6d20666163746f60448201527f727920636f6e74726163742e00000000000000000000000000000000000000006064820152608401610597565b600780547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b600061069b84848461145c565b73ffffffffffffffffffffffffffffffffffffffff841660009081526001602090815260408083203384529091529020548281101561075c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201527f6c6c6f77616e63650000000000000000000000000000000000000000000000006064820152608401610597565b61076985338584036112a8565b506001949350505050565b600061077e611710565b905090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168452909152812054909161050d9185906107c7908690612040565b6112a8565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f44697361626c656420646972656374206d696e7420666f7220496e746572436860448201527f61696e46616e5469636b657400000000000000000000000000000000000000006064820152608401610597565b600084804211156108e7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f45524332305065726d69743a3a7369676e61747572652065787069726564206460448201527f6561646c696e65000000000000000000000000000000000000000000000000006064820152608401610597565b60007feadc949c56da225ec46b6a046692f3e0896dd71c42a65e1d1998818a944086b38a8a8a6109168e611803565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810188905260e001604051602081830303815290604052805190602001209050600061097e82611838565b9050600061098e828989896118a1565b90508b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a4b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f45524332305065726d69743a3a7472616e7366657246726f6d3a20696e76616c60448201527f6964207369676e617475726500000000000000000000000000000000000000006064820152608401610597565b610a568c8c8c61145c565b5060019b9a5050505050505050505050565b60008480421115610afb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f45524332305065726d69743a3a7369676e61747572652065787069726564206460448201527f6561646c696e65000000000000000000000000000000000000000000000000006064820152608401610597565b60007fdd2f6f840cc9148db889609f1fab3c05b7a99fb969db7d8ac3c5d201c76acc318a8a8a610b2a8e611803565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810188905260e0016040516020818303038152906040528051906020012090506000610b9282611838565b90506000610ba2828989896118a1565b6007546040517f91d148540000000000000000000000000000000000000000000000000000000081527ff109839dd0a4a9f4c4954a0153b969c7cda2a8844a0bc6ea490df268017835b7600482015273ffffffffffffffffffffffffffffffffffffffff8084166024830152929350600092909116906391d148549060440160206040518083038186803b158015610c3957600080fd5b505afa158015610c4d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c719190611faf565b905080610d00576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e746572436861696e46616e5469636b65743a3a6d696e743a207369676e6560448201527f72206973206e6f742061646d696e0000000000000000000000000000000000006064820152608401610597565b610d0a8c8c611af9565b8b73ffffffffffffffffffffffffffffffffffffffff167fbd1283de19dfc808ca4d009f119027442205acf0c57c8137615992b6b3bd5d9e8c604051610d5291815260200190565b60405180910390a25060019c9b505050505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600560205260408120545b92915050565b60606004805461047d9061206f565b33600090815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8616845290915281205482811015610e6a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610597565b610e7733858584036112a8565b5060019392505050565b600061050d33848461145c565b60008480421115610f21576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f45524332305065726d69743a3a7369676e61747572652065787069726564206460448201527f6561646c696e65000000000000000000000000000000000000000000000000006064820152608401610597565b60007f897f667f5409d7c551cd2e1f25be8df1820aed12a4fb1d24d530a59ba5205fb68989610f4f8c611803565b60408051602081019590955273ffffffffffffffffffffffffffffffffffffffff909316928401929092526060830152608082015260a0810188905260c0016040516020818303038152906040528051906020012090506000610fb182611838565b90506000610fc1828989896118a1565b90508a73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461107e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f496e746572436861696e46616e5069616f3a3a6275726e42795369673a20696e60448201527f76616c6964207369676e617475726500000000000000000000000000000000006064820152608401610597565b6110888b8b611c19565b8a73ffffffffffffffffffffffffffffffffffffffff167fa29bd12184c89351609dae062403c70bfc3209a5de67f5ef978dc606e0ddb3478b6040516110d091815260200190565b60405180910390a25060019a9950505050505050505050565b83421115611153576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610597565b60007f00000000000000000000000000000000000000000000000000000000000000008888886111828c611803565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006111ea82611838565b905060006111fa828787876118a1565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611291576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610597565b61129c8a8a8a6112a8565b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff831661134a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff82166113ed576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff83166114ff576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff82166115a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015611658576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff80851660009081526020819052604080822085850390559185168152908120805484929061169c908490612040565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161170291815260200190565b60405180910390a350505050565b60007f000000000000000000000000000000000000000000000000000000000000000046141561175f57507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b73ffffffffffffffffffffffffffffffffffffffff811660009081526005602052604090208054600181018255905b50919050565b6000610d94611845611710565b836040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0821115611953576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610597565b8360ff16601b148061196857508360ff16601c145b6119f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610597565b6040805160008082526020820180845288905260ff871692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa158015611a48573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116611af0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610597565b95945050505050565b73ffffffffffffffffffffffffffffffffffffffff8216611b76576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610597565b8060026000828254611b889190612040565b909155505073ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604081208054839290611bc2908490612040565b909155505060405181815273ffffffffffffffffffffffffffffffffffffffff8316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff8216611cbc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015611d72576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401610597565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120838303905560028054849290611dae908490612058565b909155505060405182815260009073ffffffffffffffffffffffffffffffffffffffff8516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200161144f565b803573ffffffffffffffffffffffffffffffffffffffff81168114611e2257600080fd5b919050565b803560ff81168114611e2257600080fd5b600060208284031215611e49578081fd5b611e5282611dfe565b9392505050565b60008060408385031215611e6b578081fd5b611e7483611dfe565b9150611e8260208401611dfe565b90509250929050565b600080600060608486031215611e9f578081fd5b611ea884611dfe565b9250611eb660208501611dfe565b9150604084013590509250925092565b600080600080600080600060e0888a031215611ee0578283fd5b611ee988611dfe565b9650611ef760208901611dfe565b95506040880135945060608801359350611f1360808901611e27565b925060a0880135915060c0880135905092959891949750929550565b60008060408385031215611f41578182fd5b611f4a83611dfe565b946020939093013593505050565b60008060008060008060c08789031215611f70578182fd5b611f7987611dfe565b95506020870135945060408701359350611f9560608801611e27565b92506080870135915060a087013590509295509295509295565b600060208284031215611fc0578081fd5b81518015158114611e52578182fd5b6000602080835283518082850152825b81811015611ffb57858101830151858201604001528201611fdf565b8181111561200c5783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60008219821115612053576120536120bd565b500190565b60008282101561206a5761206a6120bd565b500390565b600181811c9082168061208357607f821691505b60208210811415611832577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea2646970667358221220d1f1f20418c53a58e49a33dcb999a46c4a402d58c0d4e2a32b8c461b01e8f9e864736f6c63430008040033";

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
