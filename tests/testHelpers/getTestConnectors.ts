import {
  createPublicClient,
  http,
  createWalletClient,
  // type Chain,
  // type Transport,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import * as chains from 'viem/chains'

import { sepolia } from 'viem/chains'

export const local = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [`http://127.0.0.1:8545`],
    },
  },
} as unknown as typeof sepolia

export type ChainKey = keyof typeof chains

const privKey = process.env['TEST_PRIVATE_KEY'] as `0x${string}` | undefined

if (!privKey) throw new Error('Error: please add priv key to .env')

export const getTestConnectors = () => {
  // const chain = <Chain>(chainKey ? chains[chainKey] : optimismSepolia)
  const chain = local
  // Public Client: This is used to read from the blockchain.
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  })

  // Wallet Client used to write data to the blockchain
  const walletClient = createWalletClient({
    account: privateKeyToAccount(privKey),
    chain,
    transport: http(),
  })

  return {
    publicClient,
    walletClient,
  }
}
