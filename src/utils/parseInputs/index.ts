import { FormattedAbiParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'
import tokenInfo from './tokenInfo'
import { PublicClient, WalletClient } from 'viem'
import { InverterSDK } from '../../InverterSDK'

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
  const requiredApprovalAmts = {}

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
        tokenCallback: async (decimalsTag, approvalTag, arg) => {
          const { inputWithDecimals, requiredApprovalAmt } = await tokenInfo({
            inputs: formattedInputs,
            publicClient,
            walletClient,
            decimalsTag,
            approvalTag,
            extras,
            arg,
            args,
            contract,
            self,
          })

          return inputWithDecimals
        },
      })
    })
  )

  return { inputsWithDecimals, requiredApprovalAmts }
}
