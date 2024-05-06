import { MANDATORY_MODULES, ORCHESTRATOR_CONFIG } from './constants'
import {
  DeploySchema,
  FomrattedDeploymentParameters,
  RequestedModule,
  RequestedModules,
} from './types'
import formatParameters from '../utils/formatParameters'
import { getModuleData } from '@inverter-network/abis'

export const getModuleSchema = <
  T extends RequestedModule,
  // @ts-expect-error - This is a hack to get around the fact that we can't resolve version
  Inputs = FomrattedDeploymentParameters<T['name'], T['version']>,
>(
  module: T
): {
  name: T['name']
  version: T['version']
  inputs: Inputs
} => {
  const { name, version, deploymentArgs } = getModuleData(
    module.name,
    module.version
  )!

  const { configData, dependencyData } = deploymentArgs

  const configInputs = formatParameters(configData),
    dependencyInputs = formatParameters(dependencyData)

  const inputs = configInputs.concat(dependencyInputs) as any

  return { name, version, inputs }
}

export default function getParameters<T extends RequestedModules>(
  requestedModules: T
): DeploySchema<T> {
  const mandatoryResult = MANDATORY_MODULES.reduce(
    (result, moduleType) => {
      const moduleSchema = getModuleSchema(requestedModules[moduleType])

      // @ts-expect-error - TS is not adviced to match schemas moduleType
      if (moduleSchema.inputs.length > 0) result[moduleType] = moduleSchema

      return result
    },
    {
      orchestrator: ORCHESTRATOR_CONFIG,
    } as Omit<DeploySchema<T>, 'optionalModules'>
  )

  if (!requestedModules.optionalModules?.length) return mandatoryResult as any

  const optionalModules = requestedModules.optionalModules
    .map((module) => {
      const moduleSchema = getModuleSchema(module)
      if (moduleSchema.inputs.length > 0) return moduleSchema
    })
    .filter((i): i is NonNullable<typeof i> => !!i) as any

  if (!optionalModules.length) return mandatoryResult as any

  return {
    ...mandatoryResult,
    optionalModules,
  }
}
