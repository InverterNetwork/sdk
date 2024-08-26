import { Inverter } from '../../Inverter'
import tagProcessor from '../../utils/tagProcessor'
import { formatDecimals } from './utils'

import { type PublicClient } from 'viem'
import { type FormatOutputsBaseParams } from '.'
import type {
  DecimalsTagReturn,
  ExtendedAbiParameter,
  TagCallback,
} from '@/types'

export type GetTagCallbackParams<
  T extends readonly ExtendedAbiParameter[] = readonly ExtendedAbiParameter[],
> = {
  publicClient: PublicClient
  contract?: any
  self?: Inverter
} & FormatOutputsBaseParams<T>

export default function getTagCallback({
  publicClient,
  contract,
  self,
  extendedOutputs,
  extras,
  res,
}: GetTagCallbackParams) {
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
