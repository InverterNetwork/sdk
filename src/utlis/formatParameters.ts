import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
  Tuple,
} from '@inverter-network/abis'
import { AbiParameterKind } from 'abitype'
import { FormatParametersReturn } from '../types/parameter'

export default function formatParameters<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  MK extends MethodKey<K, V>,
  PK extends AbiParameterKind,
>(inputs: Itterable<K, V, MK>[PK]) {
  type Inputs = typeof inputs
  type InputComponents = Extract<Inputs[number], Tuple>['components']

  const format = (
    parameter: Inputs[number] | InputComponents[number]
  ): FormatParametersReturn<Inputs> => {
    if ('components' in parameter)
      return {
        name: parameter.name,
        type: parameter.type,
        ...('tag' in parameter && { tag: parameter.tag }),
        components: parameter.components.map(format),
      } as any

    if ('tag' in parameter) {
      if (parameter.tag === 'any(string)') {
        return {
          name: parameter.name,
          tag: 'any(string)',
          type: 'any',
        } as any
      }

      if (parameter.tag === 'decimal') {
        return {
          name: parameter.name,
          type: 'tuple',
          tag: 'decimal',
          components: [
            {
              name: 'value',
              type: 'string',
            },
            {
              name: 'decimals',
              type: 'number',
            },
          ],
        } as any
      }
    }

    return {
      name: parameter.name,
      type: parameter.type,
    } as any
  }

  const mapped = inputs.map(format)

  return mapped as (typeof mapped)[0]
}
