import { createPublicClient, http, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'

const privKey = process.env.TEST_PRIVATE_KEY as `0x${string}` | undefined

if (!privKey) throw new Error('Error: please add priv key to .env')

export const getTestConnectors = () => {
  // Public Client: This is used to read from the blockchain.
  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  })

  // Wallet Client used to write data to the blockchain
  const walletClient = createWalletClient({
    account: privateKeyToAccount(privKey),
    chain: goerli,
    transport: http(),
  })

  return {
    publicClient,
    walletClient,
  }
}
