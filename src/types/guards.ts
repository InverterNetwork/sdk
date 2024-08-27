import type {
  TupleExtendedAbiParameter,
  NonTupleExtendedAbiParameter,
  ExtendedAbiParameter,
} from '@/types'

// Check if the result is a tuple formatted abi parameter
export const isTupleExtendedAbiParameter = (
  result: any
): result is TupleExtendedAbiParameter => {
  return result.type === 'tuple' || result.type === 'tuple[]'
}

// Check if the result is a non tuple formatted abi parameter
export const isNonTupleExtendedAbiParameter = (
  result: any
): result is NonTupleExtendedAbiParameter => {
  return !isTupleExtendedAbiParameter(result)
}

/** check if the output is not a array type-
 * and the result is an array, with a output name that starts with '_'
 */
export const isDefinedExtendedAbiMemberArray = (
  { name, type }: ExtendedAbiParameter,
  res: any
) =>
  !!name && !type.endsWith('[]') && Array.isArray(res) && name.startsWith('_')
