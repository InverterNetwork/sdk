import { ExtendedAbiParameter } from '@inverter-network/abis'
import {
  FormattedAbiParameter,
  isTupleFormattedAbiParameter,
  isNonTupleFormattedAbiParameter,
} from '../../types'

// Base case for recursion
export default function format<Parameter extends ExtendedAbiParameter>(
  // The parameter to format / format recursively if it has components
  parameter: Parameter
) {
  const result = {
    name: parameter.name,
    type: parameter.type,
    ...('description' in parameter && { description: parameter.description }),
    ...('tag' in parameter && { tag: parameter.tag }),
  } as FormattedAbiParameter

  // If the parameter is tuple or tuple[], format them
  if (isTupleFormattedAbiParameter(result) && 'components' in parameter)
    result.components = parameter.components.map(format)

  // If the parameter is not a tuple or tuple[], format it
  if (isNonTupleFormattedAbiParameter(result)) {
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
