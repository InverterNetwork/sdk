import getInputs from './getInputs'
import getRpcInteractions from './getRpcInteractions'
import type { FactoryType, GetDeployParams, RequestedModules } from '../types'

export default async function getDeploy<
  T extends RequestedModules<FT>,
  FT extends FactoryType = 'default',
>({
  requestedModules,
  factoryType = 'default' as FT,
  ...rest
}: GetDeployParams<T, FT>) {
  const inputs = getInputs(requestedModules, factoryType)

  const { run, simulate, estimateGas } = await getRpcInteractions<T, FT>({
    requestedModules,
    factoryType,
    ...rest,
  })

  return {
    inputs,
    run,
    simulate,
    estimateGas,
  }
}
