import { AbiFunction, AbiParameterKind } from 'abitype'
import { FormatParametersReturn } from '../types/parameter'

// This function is used to format the parameters of a function
export default function formatParameters<
  // TODO: Import this types from the abis package ( ExtenedAbiFunction )
  F extends AbiFunction,
  PK extends AbiParameterKind,
  Simulate extends boolean = false,
>(parameters: F[PK], simulate?: Simulate) {
  // Persisted type for the parameters
  type Parameters = typeof parameters
  // Extract the components of a parameter
  type ParameterComponents = Extract<
    Parameters[number],
    {
      components: Parameters
    }
  >['components']

  // Base case for recursion
  const format = (
    // The parameter to format / format recursively if it has components
    parameter: Parameters[number] | ParameterComponents[number]
  ): // Returns the type itterated over
  FormatParametersReturn<Parameters> => {
    // The result object
    const result: any = {
      name: parameter.name,
      type: parameter.type,
      ...('description' in parameter && { description: parameter.description }),
    }

    // If the parameter has components, format them
    if ('components' in parameter)
      result.components = parameter.components.map(format)

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

  // If the function is not to be simulated-
  // write functions always return a txHash
  if (simulate === false)
    return [
      {
        name: 'txHash',
        type: 'bytes32',
      },
    ] as never

  // Itterate over the parameters and format them
  const mapped = parameters.map(format)

  // TODO: Fix the need to select the first element at type level
  // This is a workaround to fix the type of the mapped parameters
  return mapped as (typeof mapped)[0]
}
