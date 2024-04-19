import { AbiFunction, AbiParameterKind } from 'abitype'
import { FormatParameters } from '../types'

// This function is used to format the parameters of a function
export default function formatParameters<
  // TODO: Import this types from the abis package ( ExtenedAbiFunction )
  // Known issue: Extended types are not matching with abitype utility types
  F extends AbiFunction,
  PK extends AbiParameterKind,
  Simulate extends boolean = false,
>(parameters: F[PK], simulate?: Simulate) {
  // If the function is not to be simulated-
  // write functions always return a txHash
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
export const formatParameter = <Parameters extends any[]>(
  // The parameter to format / format recursively if it has components
  parameter: Parameters[number]
) => {
  // The result object // TODO: Fix any type
  const result = <any>{
    name: parameter.name,
    type: parameter.type,
    ...('description' in parameter && { description: parameter.description }),
  }

  // If the parameter has components, format them
  if ('components' in parameter)
    result.components = parameter.components.map(formatParameter)

  // If the parameter has a tag, format it
  if ('tag' in parameter) {
    if (parameter.tag === 'any') {
      result.tag = parameter.tag
      result.type = 'any'
    }

    if (parameter.tag === 'decimals') {
      result.tag = parameter.tag
      result.type = 'string'
    }
  }

  // Simplify the type of the parameter, to typescript types
  if (parameter.type === 'uint256') result.type = 'string'
  if (parameter.type === 'uint256[]') result.type = 'string[]'
  if (parameter.type === 'bool') result.type = 'boolean'

  return result
}
