import { AbiFunction, AbiParameterKind } from 'abitype'
import {
  FormatParameters,
  FormattedAbiParameter,
  NonTupleFormattedAbiParameter,
  TupleFormattedAbiParameter,
} from '../types'
import { ExtendedAbiParameter } from '@inverter-network/abis'

// This function is used to format the parameters of a function
export default function formatParameters<
  // TODO: Import this types from the abis package ( ExtenedAbiFunction )
  // Known issue: Extended types are not matching with abitype utility types
  F extends AbiFunction,
  PK extends AbiParameterKind,
  Simulate extends boolean = false,
>(parameters: F[PK], simulate?: Simulate) {
  // If the function is not to be simulated, write functions always return a txHash
  // if simulate flag is not undefined and is false it means the function is a write function
  if (simulate === false)
    return [
      {
        name: 'txHash',
        type: 'bytes32',
      },
    ] as never

  // Itterate over the parameters and format them-
  // set the type of the mapped parameters
  const mapped = parameters.map(formatParameter) as FormatParameters<F[PK]>

  // TODO: Fix the need to select the first element at type level
  // This is a workaround to fix the type of the mapped parameters
  return mapped
}

// Base case for recursion
export const formatParameter = <Parameter extends ExtendedAbiParameter>(
  // The parameter to format / format recursively if it has components
  parameter: Parameter
) => {
  const result = {
    name: parameter.name,
    type: parameter.type,
    ...('description' in parameter && { description: parameter.description }),
    ...('tag' in parameter && { tag: parameter.tag }),
  } as FormattedAbiParameter

  // If the parameter has components, format them
  if (hasComponents(result) && 'components' in parameter)
    result.components = parameter.components.map(formatParameter)

  // If the parameter does not have components, format it
  if (doesNotHaveComponents(result)) {
    // If the parameter has a tag, format it
    if ('tag' in parameter) {
      if (parameter.tag === 'any') result.jsType = 'any'
    }

    // Simplify the type of the parameter, to typescript types, into the jsType property
    if (parameter.type === 'bool') result.jsType = 'boolean'
    if (/^u?int/.test(parameter.type)) result.jsType = 'string'
    if (/^u?int.*\[\]$/.test(parameter.type)) result.jsType = 'string[]'
    if (/^bytes/.test(parameter.type)) result.jsType = '0xstring'
    if (/^bytes.*\[\]$/.test(parameter.type)) result.jsType = '0xstring[]'
  }

  return result
}

const hasComponents = (result: any): result is TupleFormattedAbiParameter => {
  return result.type === 'tuple' || result.type === 'tuple[]'
}

const doesNotHaveComponents = (
  result: any
): result is NonTupleFormattedAbiParameter => {
  return !hasComponents(result)
}
