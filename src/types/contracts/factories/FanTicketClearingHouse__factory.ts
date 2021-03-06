/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FanTicketClearingHouse,
  FanTicketClearingHouseInterface,
} from "../FanTicketClearingHouse";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
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
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "enum FanTicketClearingHouse.TxType",
            name: "_type",
            type: "uint8",
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
        internalType: "struct FanTicketClearingHouse.TransferOrder[]",
        name: "orders",
        type: "tuple[]",
      },
    ],
    name: "handleTransferOrders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061056f806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80635afd508f14610030575b600080fd5b61004361003e36600461040a565b610045565b005b60005b818110156103ca573683838381811061008a577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b61012002919091019150600190506100a860c0830160a0840161049b565b60028111156100e0577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b141561021d576100f360208201826103cf565b73ffffffffffffffffffffffffffffffffffffffff16637527027561011e60408401602085016103cf565b61012e60608501604086016103cf565b6060850135608086013561014860e0880160c089016104ba565b60405160e087811b7fffffffff0000000000000000000000000000000000000000000000000000000016825273ffffffffffffffffffffffffffffffffffffffff96871660048301529490951660248601526044850192909252606484015260ff16608483015284013560a482015261010084013560c482015260e401602060405180830381600087803b1580156101df57600080fd5b505af11580156101f3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610217919061047b565b506103b7565b600061022f60c0830160a0840161049b565b6002811115610267577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156102a55761027a60208201826103cf565b73ffffffffffffffffffffffffffffffffffffffff1663554d67db61011e60408401602085016103cf565b6102b260208201826103cf565b73ffffffffffffffffffffffffffffffffffffffff1663d505accf6102dd60408401602085016103cf565b6102ed60608501604086016103cf565b6060850135608086013561030760e0880160c089016104ba565b60405160e087811b7fffffffff0000000000000000000000000000000000000000000000000000000016825273ffffffffffffffffffffffffffffffffffffffff96871660048301529490951660248601526044850192909252606484015260ff16608483015284013560a482015261010084013560c482015260e401600060405180830381600087803b15801561039e57600080fd5b505af11580156103b2573d6000803e3d6000fd5b505050505b50806103c2816104db565b915050610048565b505050565b6000602082840312156103e0578081fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610403578182fd5b9392505050565b6000806020838503121561041c578081fd5b823567ffffffffffffffff80821115610433578283fd5b818501915085601f830112610446578283fd5b813581811115610454578384fd5b86602061012083028501011115610469578384fd5b60209290920196919550909350505050565b60006020828403121561048c578081fd5b81518015158114610403578182fd5b6000602082840312156104ac578081fd5b813560038110610403578182fd5b6000602082840312156104cb578081fd5b813560ff81168114610403578182fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610532577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b506001019056fea26469706673582212202136d0bb85421f11bfe282e30f7c21eece181aa28e9a5783f194c9f9e583267c64736f6c63430008040033";

export class FanTicketClearingHouse__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FanTicketClearingHouse> {
    return super.deploy(overrides || {}) as Promise<FanTicketClearingHouse>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): FanTicketClearingHouse {
    return super.attach(address) as FanTicketClearingHouse;
  }
  connect(signer: Signer): FanTicketClearingHouse__factory {
    return super.connect(signer) as FanTicketClearingHouse__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FanTicketClearingHouseInterface {
    return new utils.Interface(_abi) as FanTicketClearingHouseInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FanTicketClearingHouse {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FanTicketClearingHouse;
  }
}
