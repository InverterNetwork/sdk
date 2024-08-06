import { MANDATORY_MODULES, ORCHESTRATOR_CONFIG } from './constants'
import formatParameters from '../utils/formatParameters'
import { getModuleData } from '@inverter-network/abis'

import type {
  DeploySchema,
  FomrattedDeploymentParameters,
  RequestedModule,
  RequestedModules,
} from '../types'

export const getModuleSchema = <
  T extends RequestedModule,
  Inputs = FomrattedDeploymentParameters<T>,
>(
  name: T
): {
  name: T
  inputs: Inputs
} => {
  const { deploymentInputs } = getModuleData(name as RequestedModule)

  const { configData } = deploymentInputs

  const inputs = formatParameters(configData) as any

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
