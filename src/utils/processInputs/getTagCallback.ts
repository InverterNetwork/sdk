import tagProcessor from '@/utils/tagProcessor'
import { parseDecimals } from './parse'

import type {
  DecimalsTagReturn,
  ParseGetTagCallbackParams,
  TagCallback,
} from '@/types'

export default function getTagCallback({
  requiredAllowances,
  publicClient,
  walletClient,
  contract,
  self,
  extendedInputs,
  extras,
  args,
  kind,
}: ParseGetTagCallbackParams) {
  const tagCallback: TagCallback = async (type, tags, arg) => {
    let decimalsRes: DecimalsTagReturn
    let parsedAmount: bigint

    if (type === 'parseDecimals') {
      decimalsRes = await tagProcessor.decimals({
        argsOrRes: args,
        parameters: extendedInputs,
        extras,
        tag: tags.find((t) => t.startsWith('decimals')),
        publicClient,
        contract,
        self,
      })

      parsedAmount = parseDecimals(arg, decimalsRes.decimals)

      if (kind === 'write' && tags.includes('approval' as any)) {
        const requiredAllowance = await tagProcessor.getRequiredAllowance({
          transferAmount: parsedAmount,
          publicClient,
          spenderAddress: contract?.address,
          tokenAddress: decimalsRes.tokenAddress,
          userAddress: walletClient?.account?.address,
        })

        requiredAllowances.push(requiredAllowance)
      }

      return parsedAmount
    }

    throw new Error('Invalid tag type')
  }

  return tagCallback
}
