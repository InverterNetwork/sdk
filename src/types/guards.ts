import type {
  TupleExtendedAbiParameter,
  NonTupleExtendedAbiParameter,
} from '@/types'

// Check if the result is a tuple formatted abi parameter
export const isTupleFormattedAbiParameter = (
  result: any
): result is TupleExtendedAbiParameter => {
  return result.type === 'tuple' || result.type === 'tuple[]'
}

// Check if the result is a non tuple formatted abi parameter
export const isNonTupleFormattedAbiParameter = (
  result: any
): result is NonTupleExtendedAbiParameter => {
  return !isTupleFormattedAbiParameter(result)
}
