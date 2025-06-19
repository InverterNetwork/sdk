import type {
  GetAbiFunctionSelector,
  GetModuleData,
  ModuleName,
} from '@inverter-network/abis'
import { getModuleData } from '@inverter-network/abis'
import type { ExtractAbiFunctionNames } from 'abitype'
import { toFunctionSelector } from 'viem'

/**
 * @description Creates a function selector for an Autorizer template
 * @template TModuleName - The module name
 * @param moduleName - The name of the module
 * @param functionName - The name of the function
 * @returns The function selector
 */
export const getFunctionSelector = <TModuleName extends ModuleName>(
  moduleName: TModuleName,
  functionName: ExtractAbiFunctionNames<GetModuleData<TModuleName>['abi']>
): GetAbiFunctionSelector<TModuleName> => {
  const moduleData = getModuleData(moduleName)

  if (!('abi' in moduleData)) throw new Error(`Module ${moduleName} has no abi`)

  const abi = moduleData.abi

  const func = abi.find(
    (f): f is any => f.type === 'function' && f.name === functionName
  )

  if (!func)
    throw new Error(`Function ${functionName} not found in ${moduleName}`)

  return {
    selector: toFunctionSelector(func),
    name: functionName,
  }
}
