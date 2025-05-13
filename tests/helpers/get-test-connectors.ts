import type { PopPublicClient, PopWalletClient } from '@/index'
import { getChainById } from '@/index'
import { http, createPublicClient, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const privKey = process.env['TEST_PRIVATE_KEY'] as `0x${string}` | undefined

if (!privKey) throw new Error('TEST_PRIVATE_KEY not found')

export const getTestConnectors = (): {
  publicClient: PopPublicClient
  walletClient: PopWalletClient
} => {
  // const chain = <Chain>(chainKey ? chains[chainKey] : optimismSepolia)
  const chain = getChainById(31_337) // 31_337 is the id of the anvil chain
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
