import format from './format'

import type { FormatParameters } from '../../types'
import type { ExtendedAbiParameter } from '@inverter-network/abis'

// This function is used to format the parameters of a function
export default function formatParameters<
  Parameters extends readonly ExtendedAbiParameter[],
  Simulate extends boolean = false,
>(parameters: Parameters, simulate?: Simulate) {
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
  const mapped = parameters.map(format) as FormatParameters<Parameters>

  return mapped
}
