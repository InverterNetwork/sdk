import tagProcessor from '../tag-processor'
import { formatDecimals } from './utils'

import type {
  DecimalsTagReturnType,
  FormatGetTagCallbackParams,
  TagCallback,
} from '@/types'

export default function getTagCallback({
  publicClient,
  contract,
  self,
  extendedOutputs,
  tagConfig,
  res,
}: FormatGetTagCallbackParams) {
  const tagCallback: TagCallback = async (type, tags, arg) => {
    let decimalsRes: DecimalsTagReturnType
    let formattedAmount: string

    if (type === 'formatDecimals') {
      decimalsRes = await tagProcessor.decimals({
        argsOrRes: res,
        parameters: extendedOutputs,
        tagConfig,
        tag: tags.find((t) => t.startsWith('decimals')),
        publicClient,
        contract,
        self,
      })

      formattedAmount = formatDecimals(arg, decimalsRes.decimals)

      return formattedAmount
    }

    throw new Error('Invalid tag type')
  }

  return tagCallback
}
