import { ExtendedAbiParameter } from '@inverter-network/abis'
import {
  FormattedAbiParameter,
  isTupleFormattedAbiParameter,
  isNonTupleFormattedAbiParameter,
} from '../../types'
import { getJsType } from '../../utils'

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
    const jsType = getJsType(parameter)

    if (jsType) result.jsType = jsType
  }

  return result
}
