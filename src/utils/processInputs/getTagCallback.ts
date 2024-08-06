import { Inverter } from '../../Inverter'
import tagProcessor from '../tagProcessor'
import { parseDecimals } from './parse'

import type { PublicClient, WalletClient } from 'viem'
import { type ProcessInputsBaseParams } from '.'
import type {
  DecimalsTagReturn,
  RequiredAllowances,
  TagCallback,
} from '../../types'

export type GetTagCallbackParams = {
  requiredAllowances: RequiredAllowances[]
  publicClient: PublicClient
  walletClient?: WalletClient
  contract?: any
  self?: Inverter<any>
} & ProcessInputsBaseParams

export default function getTagCallback({
  requiredAllowances,
  publicClient,
  walletClient,
  contract,
  self,
  formattedInputs,
  extras,
  args,
}: GetTagCallbackParams) {
  const tagCallback: TagCallback = async (type, tags, arg) => {
    let decimalsRes: DecimalsTagReturn
    let parsedAmount: bigint

    if (type === 'parseDecimals') {
      decimalsRes = await tagProcessor.decimals({
        argsOrRes: args,
        parameters: formattedInputs,
        extras,
        tag: tags.find((t) => t.startsWith('decimals')),
        publicClient,
        contract,
        self,
      })

      parsedAmount = parseDecimals(arg, decimalsRes.decimals)

      if (tags.includes('approval' as any)) {
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
