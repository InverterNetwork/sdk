import type {
  DecimalsTagReturnType,
  ParseGetTagCallbackParams,
  TagCallback,
} from '@/types'
import d from 'debug'
import { parseUnits } from 'viem'

import tagProcessor from '@/utils/tag-processor'

const debug = d('inverter:process-inputs:get-tag-callback')

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
      })

      parsedAmount = parseUnits(arg, decimalsRes.decimals)

      debug(`ARG + DECIMALS_RES + PARSED_AMOUNT:`, {
        arg,
        decimalsRes,
        parsedAmount,
      })

      if (
        (kind === 'write' || kind === 'bytecode') &&
        tags.includes('approval' as any)
      ) {
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
