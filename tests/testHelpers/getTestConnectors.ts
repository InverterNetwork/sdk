import { createPublicClient, http, createWalletClient, Chain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import * as chains from 'viem/chains'

type ChainKey = keyof typeof chains

const privKey = process.env['TEST_PRIVATE_KEY'] as `0x${string}` | undefined

if (!privKey) throw new Error('Error: please add priv key to .env')

export const getTestConnectors = (chainKey: ChainKey = 'optimismSepolia') => {
  const chain = <Chain>chains[chainKey]
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
