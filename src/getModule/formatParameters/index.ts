import { AbiParameterKind } from 'abitype'
import { FormatParameters } from '../../types'
import format from './format'
import { ExtendedAbiFunction } from '@inverter-network/abis'

// This function is used to format the parameters of a function
export default function <
  AbiFunction extends ExtendedAbiFunction,
  ParameterKind extends AbiParameterKind,
  Simulate extends boolean = false,
>(parameters: AbiFunction[ParameterKind], simulate?: Simulate) {
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
  const mapped = parameters.map(format) as FormatParameters<
    AbiFunction[ParameterKind]
  >

  return mapped
}
