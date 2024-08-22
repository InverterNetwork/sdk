import { createPublicClient, http, createWalletClient, type Chain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import * as chains from 'viem/chains'

import { optimismSepolia as org } from 'viem/chains'

export const optimismSepolia = {
  ...org,
  ...(true && {
    rpcUrls: {
      default: {
        http: [
          `https://optimism-sepolia.infura.io/v3/${'a54805c2acb44bb680d4770edfe62452'}`,
        ],
      },
    },
  }),
}

type ChainKey = keyof typeof chains

const privKey = process.env['TEST_PRIVATE_KEY'] as `0x${string}` | undefined

if (!privKey) throw new Error('Error: please add priv key to .env')

export const getTestConnectors = (chainKey?: ChainKey) => {
  const chain = <Chain>(chainKey ? chains[chainKey] : optimismSepolia)
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
