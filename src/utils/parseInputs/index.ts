import { FormattedAbiParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'
import tokenInfo from './tokenInfo'
import { PublicClient } from 'viem'
import { InverterSDK } from '../../InverterSDK'

export default async function parseInputs({
  formattedInputs,
  args,
  extras,
  publicClient,
  contract,
  self,
}: {
  formattedInputs: readonly FormattedAbiParameter[]
  args: any
  publicClient: PublicClient
  extras?: Extras
  contract?: any
  self?: InverterSDK
}) {
  // const inputs = formattedInputs as FormattedAbiParameter[]
  // parse the inputs
  const parsedInputs = await Promise.all(
    formattedInputs.map(async (input, index) => {
      // get the argument of the same index
      const arg = Array.isArray(args) ? args[index] : args
      // parse the input with the argument
      return await parse({
        input,
        arg,
        extras,
        tokenCallback: (decimalsTag, arg) =>
          tokenInfo({
            inputs: formattedInputs,
            publicClient,
            decimalsTag,
            extras,
            arg,
            args,
            contract,
            self,
          }),
      })
    })
  )

  return parsedInputs
}
