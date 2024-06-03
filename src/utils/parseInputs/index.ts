import { FormattedAbiParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'
import { PublicClient, WalletClient } from 'viem'
import { InverterSDK } from '../../InverterSDK'
import { RequiredAllowances } from '../../types'
import tagProcessor from '../tagProcessor'
import { DecimalsTagReturn } from '../../types'
import { parseDecimals } from './utils'

export default async function parseInputs({
  formattedInputs,
  args,
  extras,
  publicClient,
  walletClient,
  contract,
  self,
}: {
  formattedInputs: readonly FormattedAbiParameter[]
  args: any
  publicClient: PublicClient
  walletClient?: WalletClient
  extras?: Extras
  contract?: any
  self?: InverterSDK
}) {
  const requiredAllowances: RequiredAllowances[] = []

  // const inputs = formattedInputs as FormattedAbiParameter[]
  // parse the inputs
  const inputsWithDecimals = await Promise.all(
    formattedInputs.map(async (input, index) => {
      // get the argument of the same index
      const arg = Array.isArray(args) ? args[index] : args
      // parse the input with the argument
      return await parse({
        input,
        arg,
        extras,
        tagCallback: async (type, tags, arg) => {
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
        },
      })
    })
  )

  return { inputsWithDecimals, requiredAllowances }
}
