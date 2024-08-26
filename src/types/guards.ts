import type {
  TupleFormattedAbiParameter,
  NonTupleFormattedAbiParameter,
} from '@/types'

// Check if the result is a tuple formatted abi parameter
export const isTupleFormattedAbiParameter = (
  result: any
): result is TupleFormattedAbiParameter => {
  return result.type === 'tuple' || result.type === 'tuple[]'
}

// Check if the result is a non tuple formatted abi parameter
export const isNonTupleFormattedAbiParameter = (
  result: any
): result is NonTupleFormattedAbiParameter => {
  return !isTupleFormattedAbiParameter(result)
}
