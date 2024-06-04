import { PublicClient } from 'viem'
import { RequestedModules } from './types'
import getInputs from './getInputs'
import getRpcInteractions from './getRpcInteractions'
import { PopWalletClient } from '../types'

export default async function getDeploy<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  requestedModules: T
) {
  const inputs = getInputs(requestedModules)

  const { run, simulate } = getRpcInteractions(
    publicClient,
    walletClient,
    requestedModules
  )

  return { inputs, run, simulate }
}
