import { PublicClient } from 'viem'
import { RequestedModules } from './types'
import getInputs from './getInputs'
import getRpcInteractions from './getRpcInteractions'
import { PopWalletClient } from '../types'
import { InverterSDK } from '../InverterSDK'

export default async function getDeploy<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  requestedModules: T,
  self?: InverterSDK
) {
  const inputs = getInputs(requestedModules)

  const { run, simulate } = await getRpcInteractions(
    publicClient,
    walletClient,
    requestedModules,
    self
  )

  return { inputs, run, simulate }
}
