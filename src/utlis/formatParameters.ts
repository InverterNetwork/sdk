import {
  AbiParameterKind,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import { FormatParametersReturn } from '../types/parameter'
import {
  Abi,
  ModuleKeys,
  ModuleVersionKey,
  Tuple,
} from '@inverter-network/abis'

export default function formatParameters<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  FN extends ExtractAbiFunctionNames<Abi<K, V>>,
  PK extends AbiParameterKind,
>(parameters: ExtractAbiFunction<Abi<K, V>, FN>[PK]) {
  type Parameters = typeof parameters
  type ParameterComponents = Extract<Parameters[number], Tuple>['components']

  const format = (
    parameter: Parameters[number] | ParameterComponents[number]
  ): FormatParametersReturn<Parameters> => {
    if ('components' in parameter)
      return {
        name: parameter.name,
        type: parameter.type,
        components: parameter.components.map(format),
      } as any

    if ('tag' in parameter) {
      if (parameter.tag === 'any(string)')
        return {
          name: parameter.name,
          tag: parameter.tag,
          type: 'any',
        } as any

      if (parameter.tag === 'decimal')
        return {
          name: parameter.name,
          tag: parameter.tag,
          type: 'string',
        } as any
    }

    if (parameter.type === 'uint256')
      return { name: parameter.name, type: 'string' } as any

    if (parameter.type === 'uint256[]')
      return { name: parameter.name, type: 'string[]' } as any

    if (parameter.type === 'bool')
      return { name: parameter.name, type: 'boolean' } as any

    return {
      name: parameter.name,
      type: parameter.type,
    } as any
  }

  const mapped = parameters.map(format)

  return mapped as (typeof mapped)[0]
}
