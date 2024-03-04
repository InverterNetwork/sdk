import {
  Itterable,
  MethodKey,
  ModuleKeys,
  ModuleVersionKey,
  Tuple,
} from '@inverter-network/abis'
import { FormatInputsReturn } from '../types/input'

export default function formatInputs<
  K extends ModuleKeys,
  V extends ModuleVersionKey,
  MK extends MethodKey<K, V>,
>(inputs: Itterable<K, V, MK>['inputs']) {
  type Inputs = typeof inputs
  type InputComponents = Extract<Inputs[number], Tuple>['components']

  const format = (
    input: Inputs[number] | InputComponents[number]
  ): FormatInputsReturn<Inputs> => {
    if ('components' in input)
      return {
        name: input.name,
        type: input.type,
        ...('tag' in input && { tag: input.tag }),
        components: input.components.map(format),
      } as any

    if ('tag' in input) {
      if (input.tag === 'any(string)') {
        return {
          name: input.name,
          tag: input.tag,
          type: 'any',
        } as any
      }

      if (input.tag === 'decimal') {
        return {
          name: input.name,
          tag: input.tag,
          type: 'tuple',
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

    if (input.type === 'uint256')
      return { name: input.name, type: 'string' } as any

    return {
      name: input.name,
      type: input.type,
    } as any
  }

  const mapped = inputs.map(format)

  return mapped as (typeof mapped)[0]
}
