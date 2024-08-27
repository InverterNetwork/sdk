import tagProcessor from '../../utils/tagProcessor'
import { formatDecimals } from './utils'

import type {
  DecimalsTagReturn,
  FormatGetTagCallbackParams,
  TagCallback,
} from '@/types'

export default function getTagCallback({
  publicClient,
  contract,
  self,
  extendedOutputs,
  extras,
  res,
}: FormatGetTagCallbackParams) {
  const tagCallback: TagCallback = async (type, tags, arg) => {
    let decimalsRes: DecimalsTagReturn
    let formattedAmount: string

    if (type === 'formatDecimals') {
      decimalsRes = await tagProcessor.decimals({
        argsOrRes: res,
        parameters: extendedOutputs,
        extras,
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
