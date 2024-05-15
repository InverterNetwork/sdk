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
  Inputs = FomrattedDeploymentParameters<T>,
>(
  name: T
): {
  name: T
  inputs: Inputs
} => {
  const { deploymentInputs } = getModuleData(name as any)

  const { configData, dependencyData } = deploymentInputs

  const configInputs = formatParameters(configData),
    dependencyInputs = formatParameters(dependencyData)

  const inputs = configInputs.concat(dependencyInputs) as any

  return { name, inputs }
}

export default function getInputs<T extends RequestedModules>(
  requestedModules: T
): DeploySchema<T> {
  const mandatoryResult = MANDATORY_MODULES.reduce(
    (result, moduleType) => {
      const moduleSchema = getModuleSchema(requestedModules[moduleType])
      // @ts-expect-error - TS is not adviced to match schemas moduleType
      result[moduleType] = moduleSchema
      return result
    },
    {
      orchestrator: ORCHESTRATOR_CONFIG,
    } as DeploySchema<Omit<T, 'optionalModules'>>
  )

  if (!requestedModules.optionalModules?.length) return mandatoryResult

  const optionalModules = requestedModules.optionalModules.map((module) =>
    getModuleSchema(module)
  )

  return {
    ...mandatoryResult,
    optionalModules,
  }
}
