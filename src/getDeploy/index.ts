import { PublicClient, WalletClient } from 'viem'
import { RequestedModules } from './types'
import getInputs from './getInputs'
import getRun from './getRun'

export default async function getDeploy<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: WalletClient,
  requestedModules: T
) {
  const inputs = getInputs(requestedModules)

  const run = getRun(publicClient, walletClient, requestedModules)

  return { inputs, run }
}
