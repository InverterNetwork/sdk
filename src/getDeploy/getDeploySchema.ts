import { MANDATORY_MODULES, ORCHESTRATOR_CONFIG } from './constants'
import {
  GetDeploymentArgs,
  MendatoryDeploySchema,
  OptionalDeploySchema,
  RequestedModule,
  RequestedModules,
} from './types'
import formatParameters from '../utils/formatParameters'
import { getModuleData } from '@inverter-network/abis'

export const getModuleSchema = <T extends RequestedModule>(
  module: T
): {
  name: T['name']
  version: T['version']
  inputs: ReturnType<
    typeof formatParameters<
      [
        // @ts-expect-error - TS doesn't resolve version
        ...GetDeploymentArgs<T['name'], T['version']>['configData'],
        // @ts-expect-error - TS doesn't resolve version
        ...GetDeploymentArgs<T['name'], T['version']>['dependencyData'],
      ]
    >
  >
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

export default function <T extends RequestedModules>(requestedModules: T) {
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
