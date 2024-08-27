import getInputs from './getInputs'
import type { FactoryType, GetDeployParams, RequestedModules } from '../types'
import getMethods from './getMethods'

export default async function getDeploy<
  T extends RequestedModules<FT extends undefined ? 'default' : FT>,
  FT extends FactoryType | undefined = undefined,
>({ requestedModules, factoryType, ...params }: GetDeployParams<T, FT>) {
  const defaultFactoryType = (factoryType ?? 'default') as FT extends undefined
    ? 'default'
    : FT

  const inputs = getInputs(requestedModules, defaultFactoryType)

  const { publicClient, walletClient } = params

  // Get the methods from the Viem handler
  const { run, simulate, estimateGas } = await getMethods({
    requestedModules,
    factoryType: defaultFactoryType,
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
