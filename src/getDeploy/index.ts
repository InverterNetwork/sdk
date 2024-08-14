import getInputs from './getInputs'
import type { FactoryType, GetDeployParams, RequestedModules } from '../types'
import getMethods from './getMethods'

export default async function getDeploy<
  T extends RequestedModules<FT>,
  FT extends FactoryType = 'default',
>({
  requestedModules,
  factoryType = 'default' as FT,
  ...params
}: GetDeployParams<T, FT>) {
  const inputs = getInputs(requestedModules, factoryType)

  const { publicClient, walletClient } = params

  // Get the methods from the Viem handler
  const { run, simulate, estimateGas } = await getMethods({
    requestedModules,
    factoryType,
    publicClient,
    walletClient,
  })

  return {
    inputs,
    run,
    simulate,
    estimateGas,
  }
}
