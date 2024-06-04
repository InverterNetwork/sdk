import { PublicClient } from 'viem'
import { FormatOutputsBaseParams } from '.'
import { InverterSDK } from '../../InverterSDK'
import {
  DecimalsTagReturn,
  FormattedAbiParameter,
  TagCallback,
} from '../../types'
import tagProcessor from '../../utils/tagProcessor'
import { formatDecimals } from './utils'

export type GetTagCallbackParams<
  T extends readonly FormattedAbiParameter[] = readonly FormattedAbiParameter[],
> = {
  publicClient: PublicClient
  contract?: any
  self?: InverterSDK
} & FormatOutputsBaseParams<T>

export default function getTagCallback({
  publicClient,
  contract,
  self,
  formattedOutputs,
  extras,
  res,
}: GetTagCallbackParams) {
  const tagCallback: TagCallback = async (type, tags, arg) => {
    let decimalsRes: DecimalsTagReturn
    let formattedAmount: string

    if (type === 'formatDecimals') {
      decimalsRes = await tagProcessor.decimals({
        argsOrRes: res,
        parameters: formattedOutputs,
        extras,
        tag: tags.find((t) => t.startsWith('decimals')),
        publicClient,
        contract,
        self,
      })

      console.log('decimalsRes', decimalsRes, 'arg', arg)

      formattedAmount = formatDecimals(arg, decimalsRes.decimals)

      return formattedAmount
    }

    throw new Error('Invalid tag type')
  }

  return tagCallback
}
