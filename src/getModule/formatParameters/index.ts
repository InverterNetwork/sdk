import { AbiFunction, AbiParameterKind } from 'abitype'
import { FormatParameters } from '../../types'
import format from './format'

// This function is used to format the parameters of a function
export default function <
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
  const mapped = parameters.map(format) as FormatParameters<F[PK]>

  // TODO: Fix the need to select the first element at type level
  // This is a workaround to fix the type of the mapped parameters
  return mapped
}
