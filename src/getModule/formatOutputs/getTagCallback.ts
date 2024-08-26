import { Inverter } from '../../Inverter'
import tagProcessor from '../../utils/tagProcessor'
import { formatDecimals } from './utils'

import { type PublicClient } from 'viem'
import type {
  DecimalsTagReturn,
  ExtendedAbiParameter,
  Extras,
  TagCallback,
} from '@/types'

export type GetTagCallbackParams<
  T extends readonly ExtendedAbiParameter[] = readonly ExtendedAbiParameter[],
> = {
  extendedOutputs: T
  res: any
  extras?: Extras
  publicClient: PublicClient
  contract?: any
  self?: Inverter
}

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
