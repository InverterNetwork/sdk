import { PublicClient, WalletClient } from 'viem'
import { ParseInputsBaseParams } from '.'
import { InverterSDK } from '../../InverterSDK'
import { DecimalsTagReturn, RequiredAllowances, TagCallback } from '../../types'
import tagProcessor from '../tagProcessor'
import { parseDecimals } from './parse'

export type GetTagCallbackParams = {
  requiredAllowances: RequiredAllowances[]
  publicClient: PublicClient
  walletClient?: WalletClient
  contract?: any
  self?: InverterSDK
} & ParseInputsBaseParams

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
        args,
        inputs: formattedInputs,
        extras,
        decimalsTag: tags.find((t) => t.startsWith('decimals')),
        publicClient,
        contract,
        self,
      })

      parsedAmount = parseDecimals(arg, decimalsRes.decimals)

      if (tags.includes('approval' as any))
        requiredAllowances.push(
          await tagProcessor.approval({
            transferAmount: parsedAmount,
            publicClient,
            spenderAddress: contract.address,
            tokenAddress: decimalsRes.tokenAddress,
            userAddress: walletClient?.account?.address,
          })
        )

      return parsedAmount
    }

    throw new Error('Invalid tag type')
  }

  return tagCallback
}