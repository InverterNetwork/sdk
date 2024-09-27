import type { PopPublicClient, PopWalletClient } from '@'
import { http, createPublicClient, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { anvil } from 'viem/chains'

const privKey = process.env['TEST_PRIVATE_KEY'] as `0x${string}` | undefined

if (!privKey) throw new Error('TEST_PRIVATE_KEY not found')

export const getTestConnectors = (): {
  publicClient: PopPublicClient
  walletClient: PopWalletClient
} => {
  // const chain = <Chain>(chainKey ? chains[chainKey] : optimismSepolia)
  const chain = anvil
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
