import { BadRequestException } from "@nestjs/common";
import { BigNumber, BigNumberish, utils, Wallet } from "ethers";
import type { InterChainFanTicketFactory } from "../../types/contracts/InterChainFanTicketFactory";
import type { InterChainFanTicket } from "../../types/contracts/InterChainFanTicket";
import {
  TransferOrder,
  MintOrder,
  InterChainCreationPermit,
  ApproveOrder,
  TxType
} from "./typing";
import { InterChainParking } from "src/types/contracts";

export class InterChainPermitService {
    static getDeadline(howManySecond = 3600 * 24 * 30): number {
        return Math.floor(Date.now() / 1000) + howManySecond;
    }

    static addressChecker(enterAddress: string): void {
        if (!utils.isAddress(enterAddress)) {
            throw new BadRequestException('Bad address you provided, please double check your inputed address.')
        }
    }

    static async TransferOrderConstuctor(
        token: InterChainFanTicket,
        from: Wallet,
        to: string,
        value: BigNumberish,
        nonce: number,
        validPeriod = 3600
    ): Promise<TransferOrder> {
        this.addressChecker(to);
        const deadline = this.getDeadline(validPeriod);
        const chainId = await from.getChainId();

        const signature = await from._signTypedData(
        {
            name: await token.name(),
            version: "1",
            chainId: chainId,
            verifyingContract: token.address,
        },
        {
            Transfer: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            {
                name: "value",
                type: "uint256",
            },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
            ],
        },
        {
            from: from.address,
            to,
            value,
            nonce,
            deadline,
        });

        const { r, s, v } = utils.splitSignature(signature);

        return {
            token: token.address,
            from: from.address,
            to,
            value,
            _type: TxType.Transfer,
            deadline,
            v,
            r,
            s,
        };
    }

    static async MintOrderConstuctor(
        token: InterChainFanTicket,
        adminWallet: Wallet,
        to: string,
        value: BigNumberish,
        nonce: number
    ): Promise<MintOrder> {
        this.addressChecker(to);
        const deadline = this.getDeadline();
        const chainId = await adminWallet.getChainId();

        const signature = await adminWallet._signTypedData(
        {
            name: await token.name(),
            version: "1",
            chainId: chainId,
            verifyingContract: token.address,
        },
        {
            Mint: [
            { name: "minter", type: "address" },
            { name: "to", type: "address" },
            {
                name: "value",
                type: "uint256",
            },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
            ],
        },
        {
            minter: adminWallet.address,
            to,
            value,
            nonce,
            deadline,
        }
        );

        const { r, s, v } = utils.splitSignature(signature);

        return {
            token: token.address,
            from: adminWallet.address,
            to,
            value,
            _type: TxType.Mint,
            deadline,
            v,
            r,
            s,
        };
    }

    static async ApproveOrderConstructor(
        fanTicket: InterChainFanTicket,
        theOwner: Wallet,
        spender: string,
        targetAmount: BigNumber,
        nonce: number,
        validPeriod = 3600
    ): Promise<ApproveOrder> {
        this.addressChecker(spender);
        const deadline = this.getDeadline(validPeriod);
        const ownerAddress = await theOwner.getAddress();
        const chainId = await theOwner.getChainId();

        const msg = {
            owner: ownerAddress,
            spender,
            value: targetAmount,
            nonce,
            deadline,
        };

        const signature = await theOwner._signTypedData(
        {
            name: await fanTicket.name(),
            version: "1",
            chainId: chainId,
            verifyingContract: fanTicket.address,
        },
        {
            Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            {
                name: "value",
                type: "uint256",
            },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
            ],
        },
        msg
        );

        const { r, s, v } = utils.splitSignature(signature);
        return {
            token: fanTicket.address,
            from: ownerAddress,
            to: spender,
            value: targetAmount.toString(),
            _type: TxType.Permit,
            deadline,
            v,
            r,
            s,
        };
    }

    static async CreationPermitConstuctor(
        factory: InterChainFanTicketFactory,
        adminWallet: Wallet,
        originAddress: string,
        name: string,
        symbol: string,
        tokenId: number,
        originChainId: BigNumberish
      ): Promise<InterChainCreationPermit> {
        const chainId = await adminWallet.getChainId();
        const signature = await adminWallet._signTypedData(
          {
            name: "InterChainFanTicketFactory",
            version: "1",
            chainId: chainId,
            verifyingContract: factory.address,
          },
          {
            CreationPermit: [
              { name: "originAddress", type: "address" },
              { name: "name", type: "string" },
              { name: "symbol", type: "string" },
              { name: "tokenId", type: "uint32" },
              { name: "originChainId", type: "uint256" },
            ],
          },
          {
            originAddress,
            name,
            symbol,
            tokenId,
            originChainId: originChainId.toString(),
          }
        );
      
        const { r, s, v } = utils.splitSignature(signature);
      
        return {
          originAddress,
          name,
          symbol,
          tokenId,
          originChainId: BigNumber.from(originChainId),
          v,
          r,
          s,
        };
      }

    static async ParkingWithdrawConstuctor(
        parking: InterChainParking,
        token: string,
        admin: Wallet,
        who: string,
        value: BigNumberish,
        nonce: number
      ) {
        const deadline = InterChainPermitService.getDeadline();
        const chainId = await admin.getChainId();
      
        const signature = await admin._signTypedData(
          {
            name: "InterChainParking",
            version: "1",
            chainId: chainId,
            verifyingContract: parking.address,
          },
          {
            Withdraw: [
              { name: "token", type: "address" },
              { name: "to", type: "address" },
              {
                name: "value",
                type: "uint256",
              },
              { name: "nonce", type: "uint256" },
              { name: "deadline", type: "uint256" },
            ],
          },
          {
            token,
            to: who,
            value,
            nonce,
            deadline,
          }
        );
      
        const { r, s, v } = utils.splitSignature(signature);
      
        return {
          token,
          who,
          value,
          nonce,
          deadline,
          v,
          r,
          s,
        };
      }      
}