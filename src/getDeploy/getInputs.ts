import { MANDATORY_MODULES } from './constants'
import { getModuleData } from '@inverter-network/abis'
import type { ModuleName } from '@inverter-network/abis'

import type {
  DeploySchema,
  FactoryType,
  FindStringByPart,
  ModuleSchema,
  RequestedModule,
  RequestedModules,
} from '../types'

export const getModuleSchema = <
  T extends RequestedModule | FindStringByPart<ModuleName, 'Factory'>,
  ON extends string | undefined = undefined,
>(
  name: T,
  overrideName?: ON
) => {
  const moduleData = getModuleData(name)

  if (!('deploymentInputs' in moduleData))
    throw new Error("Module data doesn't have deploymentsData")

  const inputs = !!overrideName
    ? moduleData.deploymentInputs.configData.find(
        ({ name }) => name === overrideName
      )
    : moduleData.deploymentInputs.configData

  const result = {
    inputs,
    name: overrideName ?? name,
  } as ModuleSchema<T, ON>

  return result
}

export const getOtherFactoryTypeInputs = <FT extends FactoryType>(
  factoryType: FT
) => {
  switch (factoryType) {
    case 'restricted-pim':
      return {
        issuanceToken: getModuleSchema(
          'Restricted_PIM_Factory_v1',
          'issuanceToken'
        ),
        beneficiary: getModuleSchema(
          'Restricted_PIM_Factory_v1',
          'beneficiary'
        ),
      }
    case 'immutable-pim':
      return {
        issuanceToken: getModuleSchema(
          'Immutable_PIM_Factory_v1',
          'issuanceToken'
        ),
        initialPurchaseAmount: getModuleSchema(
          'Immutable_PIM_Factory_v1',
          'initialPurchaseAmount'
        ),
      }
    default:
      return {}
  }
}

export default function getInputs<
  T extends RequestedModules,
  FT extends FactoryType,
>(requestedModules: T, factoryType: FT): DeploySchema<T, FT> {
  const mandatoryResult = MANDATORY_MODULES.reduce(
    (result, moduleType) => {
      const moduleSchema = getModuleSchema(requestedModules[moduleType])
      // @ts-expect-error - TS is not adviced to match schemas moduleType
      result[moduleType] = moduleSchema
      return result
    },
    {
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      ...getOtherFactoryTypeInputs(factoryType),
    } as unknown as DeploySchema<Omit<T, 'optionalModules'>, FT>
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
