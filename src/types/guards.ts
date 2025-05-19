import type {
  ExtendedAbiParameter,
  NonTupleExtendedAbiParameter,
  TupleExtendedAbiParameter,
} from '@/types'

/**
 * @description Check if the result is a tuple formatted abi parameter
 * @param result - The result
 * @returns The result is a tuple formatted abi parameter
 */
export const isTupleExtendedAbiParameter = (
  result: any
): result is TupleExtendedAbiParameter => {
  return result.type === 'tuple' || result.type === 'tuple[]'
}

/**
 * @description Check if the result is a non tuple formatted abi parameter
 * @param result - The result
 * @returns The result is a non tuple formatted abi parameter
 */
export const isNonTupleExtendedAbiParameter = (
  result: any
): result is NonTupleExtendedAbiParameter => {
  return !isTupleExtendedAbiParameter(result)
}

/**
 * @description Check if the output is not a array type-
 * and the result is an array, with a output name that starts with '_'
 * @param {ExtendedAbiParameter} param0 - The extended abi parameter
 * @param {any} res - The result
 * @returns The result is a defined extended abi member array
 */
export const isDefinedExtendedAbiMemberArray = (
  { name, type }: ExtendedAbiParameter,
  res: any
) =>
  !!name && !type.endsWith('[]') && Array.isArray(res) && name.startsWith('_')
