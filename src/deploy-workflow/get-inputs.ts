// external dependencies
import { getModuleData } from '@inverter-network/abis'
import type { ModuleName } from '@inverter-network/abis'
// sdk types
import type {
  FindStringByPart,
  GetDeployWorkflowInputs,
  GetDeployWorkflowModuleInputs,
  MixedRequestedModules,
  ModuleData,
  RequestedModule,
} from '@/types'

// get-deploy constants
import { MANDATORY_MODULES } from './constants'

/**
 * @description Get the module inputs for the deployment
 * @param name - The name of the module
 * @param overrideName - The override name of the module
 * @param factoryType - The factory type of the module
 * @returns The module inputs
 */
export function getDeployWorkflowModuleInputs<
  T extends
    | RequestedModule
    | ModuleData
    | FindStringByPart<ModuleName, 'Factory'>,
  ON extends string | undefined = undefined,
>(requestedModule: T, overrideName?: ON): GetDeployWorkflowModuleInputs<T, ON> {
  const moduleData =
    typeof requestedModule === 'object'
      ? requestedModule
      : getModuleData(requestedModule)

  if (!('deploymentInputs' in moduleData))
    throw new Error("Module data doesn't have deploymentsData")

  if (!moduleData.deploymentInputs)
    throw new Error("Module data doesn't have configData")

  let inputs = !!overrideName
    ? [
        moduleData.deploymentInputs.configData.find(
          ({ name }) => name === overrideName
        ),
      ]
    : moduleData.deploymentInputs.configData

  const result = {
    inputs,
    name: overrideName ?? requestedModule,
  } as GetDeployWorkflowModuleInputs<T, ON>

  return result
}

/**
 * @description Get the inputs for the deployment
 * @param requestedModules - The requested modules
 * @param factoryType - The factory type
 * @returns The inputs
 */
export function getDeployWorkflowInputs<T extends MixedRequestedModules>(
  requestedModules: T
): GetDeployWorkflowInputs<T> {
  const mandatoryResult = MANDATORY_MODULES.reduce(
    (result, moduleType) => {
      const moduleSchema = getDeployWorkflowModuleInputs(
        requestedModules[moduleType]
      )
      result[moduleType] = moduleSchema
      return result
    },
    {
      orchestrator: getDeployWorkflowModuleInputs('OrchestratorFactory_v1'),
      authorizer: {},
      fundingManager: {},
      paymentProcessor: {},
    } as any
  )

  if (!requestedModules.optionalModules?.length) return mandatoryResult

  const optionalModules = requestedModules.optionalModules.map((module) =>
    getDeployWorkflowModuleInputs(module)
  )

  return {
    ...mandatoryResult,
    optionalModules,
  }
}
