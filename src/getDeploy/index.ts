import getInputs from './getInputs'
import getRpcInteractions from './getRpcInteractions'
import { Inverter } from '../Inverter'

import { type PublicClient } from 'viem'
import type { PopWalletClient, RequestedModules } from '../types'

export default async function getDeploy<T extends RequestedModules>(
  publicClient: PublicClient,
  walletClient: PopWalletClient,
  requestedModules: T,
  self?: Inverter
) {
  const inputs = getInputs(requestedModules)

  const { run, simulate, estimateGas } = await getRpcInteractions({
    publicClient,
    walletClient,
    requestedModules,
    self,
  })

  return {
    inputs,
    run,
    simulate,
    estimateGas,
  }
}
