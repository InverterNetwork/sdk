import { MANDATORY_MODULES } from './constants'
import formatParameters from '../utils/formatParameters'
import { getModuleData, type ModuleName } from '@inverter-network/abis'

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
): ModuleSchema<T, ON> => {
  const { deploymentInputs } = getModuleData(name as RequestedModule)
  const { configData } = deploymentInputs
  const inputs = formatParameters({ parameters: configData }) as any
  const conditionalName = (overrideName ?? name) as any
  return { name: conditionalName, inputs }
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
      }
    case 'immutable-pim':
      return {
        issuanceToken: getModuleSchema(
          'Restricted_PIM_Factory_v1',
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
  FT extends FactoryType = 'default',
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
    } as DeploySchema<Omit<T, 'optionalModules'>, FT>
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
