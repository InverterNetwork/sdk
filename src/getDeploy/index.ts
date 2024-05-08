import { PublicClient, WalletClient } from 'viem'
import { RequestedModules } from './types'
import getInputs from './getInputs'
import getRpcInteractions from './getRpcInteractions'

export default async function getDeploy<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: WalletClient,
  requestedModules: T
) {
  const inputs = getInputs(requestedModules)

  const { run, simulateRun } = getRpcInteractions(
    publicClient,
    walletClient,
    requestedModules
  )

  return { inputs, run, simulateRun }
}
