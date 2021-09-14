import { BadRequestException } from "@nestjs/common";
import { BigNumber, BigNumberish, utils, Wallet } from "ethers";
import { currentChainId } from "../constant";
import type { FanTicketFactory } from "../types/contracts/FanTicketFactory";
import type { FanTicketV2 } from "../types/contracts/FanTicketV2";
import {
  TransferOrder,
  MintOrder,
  CreationPermit,
  ApproveOrder,
  TxType
} from "./typing";

export class PermitService {
    static getDeadline(howManySecond = 3600 * 24 * 30): number {
        return Math.floor(Date.now() / 1000) + howManySecond;
    }

    static addressChecker(enterAddress: string): void {
        if (!utils.isAddress(enterAddress)) {
            throw new BadRequestException('Bad address you provided, please double check your inputed address.')
        }
    }

    /**
     * Generate a permit for ClearingHouse to execute `transferFromBySig`
     * @param token the token contract object
     * @param from the sender of this transfer
     * @param to the receipient of this transfer
     * @param value the value of this transfer
     * @param nonce the nonce of this transaction(related with the `from` and the `token`)
     * @param validPeriod the period of permit's validity
     * @returns a TransferOrder for ClearingHouse to handle
     */
    static async TransferOrderConstuctor(
        token: FanTicketV2,
        from: Wallet,
        to: string,
        value: BigNumberish,
        nonce: number,
        validPeriod = 3600
    ): Promise<TransferOrder> {
        this.addressChecker(to);
        const deadline = this.getDeadline(validPeriod);
        const chainId = currentChainId;

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

    /**
     * Generate a permit for ClearingHouse to execute `mintFromBySig`
     * @param token the token contract object
     * @param from the minter of this mint
     * @param to the receipient of this mint
     * @param value the value of this mint
     * @param nonce the nonce of this transaction(related with the `from` and the `token`)
     * @param validPeriod the period of permit's validity
     * @returns a MintOrder for ClearingHouse to handle
     */
    static async MintOrderConstuctor(
        token: FanTicketV2,
        from: Wallet,
        to: string,
        value: BigNumberish,
        nonce: number
    ): Promise<MintOrder> {
        this.addressChecker(to);
        const deadline = this.getDeadline();
        const chainId = currentChainId;

        const signature = await from._signTypedData(
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
            minter: from.address,
            to,
            value,
            nonce,
            deadline,
        }
        );

        const { r, s, v } = utils.splitSignature(signature);

        return {
            token: token.address,
            from: from.address,
            to,
            value,
            _type: TxType.Mint,
            deadline,
            v,
            r,
            s,
        };
    }

    /**
     * Generate a permit for ClearingHouse to execute `permit` (EIP-2612)
     * @param fanTicket the token contract object
     * @param theOwner the Owner of this token who acting the approve
     * @param spender the spender of this approve
     * @param targetAmount the value of this approve
     * @param nonce the nonce of this transaction(related with the `from` and the `token`)
     * @param validPeriod the period of permit's validity
     * @returns a EIP-2612 permit for ClearingHouse to handle
     */
    static async ApproveOrderConstructor(
        fanTicket: FanTicketV2,
        theOwner: Wallet,
        spender: string,
        targetAmount: BigNumber,
        nonce: number,
        validPeriod = 3600
    ): Promise<ApproveOrder> {
        this.addressChecker(spender);
        const chainId = currentChainId;
        const deadline = this.getDeadline(validPeriod);
        const ownerAddress = await theOwner.getAddress();

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

    /**
     * Generate a permit as admin, to create a token
     * @param factory the FanTicket Factory object
     * @param adminWallet the wallet who is the admin of the factory
     * @param name the name of the new token
     * @param symbol the symbol of the new token
     * @param owner the owner of the new token
     * @param tokenId the tokenId in the database(for on-chain referrence)
     * @param initialSupply the initial supply of creation
     * @returns the creation permit for batching
     */
    static async CreationPermitConstuctor(
        factory: FanTicketFactory,
        adminWallet: Wallet,
        name: string,
        symbol: string,
        owner: string,
        tokenId: number,
        initialSupply: BigNumberish = 0
    ): Promise<CreationPermit> {
        const chainId = currentChainId;
        const signature = await adminWallet._signTypedData(
        {
            name: "FanTicketFactory",
            version: "1",
            chainId: chainId,
            verifyingContract: factory.address,
        },
        {
            CreationPermit: [
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            {
                name: "owner",
                type: "address",
            },
            { name: "initialSupply", type: "uint256" },
            { name: "tokenId", type: "uint32" },
            ],
        },
        {
            name,
            symbol,
            owner,
            initialSupply: initialSupply.toString(),
            tokenId,
        }
        );

        const { r, s, v } = utils.splitSignature(signature);

        return {
            name,
            symbol,
            owner,
            initialSupply,
            tokenId,
            v,
            r,
            s,
        };
    }

}