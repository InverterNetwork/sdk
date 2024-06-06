import { PublicClient } from 'viem'
import { RequestedModules } from './types'
import getInputs from './getInputs'
import getRpcInteractions from './getRpcInteractions'
import { PopWalletClient } from '../types'
import { Inverter } from '../Inverter'

export default async function getDeploy<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  requestedModules: T,
  self?: Inverter
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
