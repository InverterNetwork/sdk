import format from './format'

import type { FormatParameters, MethodKind } from '../../types'
import type { ExtendedAbiParameter } from '@inverter-network/abis'

// This function is used to format the parameters of a function
export default function formatParameters<
  Parameters extends readonly ExtendedAbiParameter[],
  Kind extends MethodKind,
>({ parameters, kind }: { parameters: Parameters; kind?: Kind }) {
  switch (kind) {
    // If the function is not to be simulated, write functions always return a txHash
    case 'simulate':
      return [
        {
          name: 'txHash',
          type: 'bytes32',
        },
      ] as never

    case 'estimateGas':
      return [
        {
          name: 'gas',
          type: 'tuple',
          components: [
            {
              name: 'value',
              type: 'uint256',
            },
            {
              name: 'formatted',
              type: 'string',
            },
          ],
        },
      ] as never

    default:
      // Itterate over the parameters and format them-
      // set the type of the mapped parameters
      const mapped = parameters.map(format) as FormatParameters<Parameters>

      return mapped
  }
}
