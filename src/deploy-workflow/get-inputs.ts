// external dependencies
import { getModuleData } from '@inverter-network/abis'
import type { ModuleName } from '@inverter-network/abis'

// sdk types
import type {
  GetDeployWorkflowSchema,
  GetDeployWorkflowModuleInputs,
  FactoryType,
  FindStringByPart,
  RequestedModule,
  RequestedModules,
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
  T extends RequestedModule | FindStringByPart<ModuleName, 'Factory'>,
  ON extends string | undefined = undefined,
>(
  name: T,
  overrideName?: ON,
  factoryType?: FactoryType
): GetDeployWorkflowModuleInputs<T, ON> {
  const moduleData = getModuleData(name)

  if (!('deploymentInputs' in moduleData))
    throw new Error("Module data doesn't have deploymentsData")

  let inputs = !!overrideName
    ? [
        moduleData.deploymentInputs.configData.find(
          ({ name }) => name === overrideName
        ),
      ]
    : moduleData.deploymentInputs.configData

  if (name.includes('FM_BC') && factoryType && factoryType !== 'default') {
    inputs = inputs.filter((i) => i?.name !== 'issuanceToken') as any
  }

  const result = {
    inputs,
    name: overrideName ?? name,
  } as GetDeployWorkflowModuleInputs<T, ON>

  return result
}

/**
 * @description Get the other factory type inputs for the deployment
 * @param factoryType - The factory type of the deployment
 * @returns The other factory type inputs
 */
export function getOtherFactoryTypeInputs<FT extends FactoryType>(
  factoryType: FT
) {
  switch (factoryType) {
    case 'restricted-pim':
      return {
        issuanceToken: getDeployWorkflowModuleInputs(
          'Restricted_PIM_Factory_v1',
          'issuanceToken'
        ),
        beneficiary: getDeployWorkflowModuleInputs(
          'Restricted_PIM_Factory_v1',
          'beneficiary'
        ),
      }
    case 'immutable-pim':
      return {
        issuanceToken: getDeployWorkflowModuleInputs(
          'Immutable_PIM_Factory_v1',
          'issuanceToken'
        ),
        initialPurchaseAmount: getDeployWorkflowModuleInputs(
          'Immutable_PIM_Factory_v1',
          'initialPurchaseAmount'
        ),
      }
    case 'migrating-pim':
      return {
        issuanceToken: getDeployWorkflowModuleInputs(
          'Immutable_PIM_Factory_v1',
          'issuanceToken'
        ),
        initialPurchaseAmount: getDeployWorkflowModuleInputs(
          'Immutable_PIM_Factory_v1',
          'initialPurchaseAmount'
        ),
        migrationConfig: getDeployWorkflowModuleInputs(
          'Migrating_PIM_Factory_v1',
          'migrationConfig'
        ),
      }
    default:
      return {}
  }
}

/**
 * @description Get the inputs for the deployment
 * @param requestedModules - The requested modules
 * @param factoryType - The factory type
 * @returns The inputs
 */
export function getDeployWorkflowInputs<
  T extends RequestedModules,
  FT extends FactoryType,
>(requestedModules: T, factoryType: FT): GetDeployWorkflowSchema<T, FT> {
  const mandatoryResult = MANDATORY_MODULES.reduce(
    (result, moduleType) => {
      const moduleSchema = getDeployWorkflowModuleInputs(
        requestedModules[moduleType],
        undefined,
        factoryType
      )
      // @ts-expect-error - TS is not adviced to match schemas moduleType
      result[moduleType] = moduleSchema
      return result
    },
    {
      orchestrator: getDeployWorkflowModuleInputs('OrchestratorFactory_v1'),
      authorizer: {},
      fundingManager: {},
      paymentProcessor: {},
      ...getOtherFactoryTypeInputs(factoryType),
    } as unknown as GetDeployWorkflowSchema<Omit<T, 'optionalModules'>, FT>
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
