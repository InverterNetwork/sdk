import tagProcessor from '@/utils/tag-processor'
import { parseDecimals } from './parse'

import type {
  DecimalsTagReturnType,
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
  tagConfig,
  args,
  kind,
  tagOverwrites,
}: ParseGetTagCallbackParams) {
  const tagCallback: TagCallback = async (type, tags, arg) => {
    let decimalsRes: DecimalsTagReturnType
    let parsedAmount: bigint

    if (type === 'parseDecimals') {
      decimalsRes = await tagProcessor.decimals({
        argsOrRes: args,
        parameters: extendedInputs,
        tagConfig,
        tag: tags.find((t) => t.startsWith('decimals')),
        publicClient,
        contract,
        self,
        tagOverwrites,
      })

      parsedAmount = parseDecimals(arg, decimalsRes.decimals)

      if (kind === 'write' && tags.includes('approval' as any)) {
        const requiredAllowance = await tagProcessor.allowance({
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
