import { Wallet } from "ethers";

const wallet = Wallet.createRandom()

console.info(`The New Wallet address: ${wallet.address}`)
console.info(`Private key: ${wallet.privateKey} (Keep it safe)`)