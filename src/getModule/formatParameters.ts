import { AbiFunction, AbiParameterKind } from 'abitype'
import { FormatParametersReturn } from '../types/parameter'

export default function formatParameters<
  F extends AbiFunction,
  PK extends AbiParameterKind,
  Simulate extends boolean = false,
>(parameters: F[PK], simulate?: Simulate) {
  type Parameters = typeof parameters
  type ParameterComponents = Extract<
    Parameters[number],
    {
      components: Parameters
    }
  >['components']

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
      if (parameter.tag === 'any')
        return {
          name: parameter.name,
          tag: parameter.tag,
          type: 'any',
        } as any

      if (parameter.tag === 'decimals')
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

  if (simulate === false)
    return [
      {
        name: 'txHash',
        type: 'bytes32',
      },
    ] as never

  const mapped = parameters.map(format)

  return mapped as (typeof mapped)[0]
}
