import { MANDATORY_MODULES, ORCHESTRATOR_CONFIG } from './constants'
import {
  FomrattedDeploymentParameters,
  MendatoryDeploySchema,
  OptionalDeploySchema,
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

export default function <T extends RequestedModules>(
  requestedModules: T
): {
  orchestrator: typeof ORCHESTRATOR_CONFIG
} {
  const mandatoryResult = {} as MendatoryDeploySchema
  const optionalResult = [] as NonNullable<
    OptionalDeploySchema['optionalModules']
  >

  // Handle mandatory modules
  MANDATORY_MODULES.forEach((moduleType) => {
    const moduleSchema = getModuleSchema(requestedModules[moduleType])

    if (moduleSchema.inputs.length > 0)
      mandatoryResult[moduleType] = moduleSchema
  })

  // Handle optional modules, if any
  if (
    requestedModules.optionalModules &&
    requestedModules.optionalModules.length > 0
  ) {
    requestedModules.optionalModules.forEach((module) => {
      const moduleSchema = getModuleSchema(module)
      if (moduleSchema.inputs.length > 0) optionalResult.push(moduleSchema)
    })
  }

  // Return Orchestrator Schema, Mendatory Modules Schema and if any Optional Modules Schema
  return {
    orchestrator: ORCHESTRATOR_CONFIG,
    ...(optionalResult.length && { optionalModules: optionalResult }),
    ...mandatoryResult,
  }
}
