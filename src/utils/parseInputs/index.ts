import { FormattedAbiParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'
import decimals from './decimals'
import { PublicClient } from 'viem'

export default async function parseInputs({
  formattedInputs,
  args,
  extras,
  publicClient,
  contract,
}: {
  formattedInputs: readonly FormattedAbiParameter[]
  args: any
  publicClient: PublicClient
  extras?: Extras
  contract?: any
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
        decimalsCallback: (decimalsTag, arg) =>
          decimals({
            inputs: formattedInputs,
            publicClient,
            decimalsTag,
            extras,
            arg,
            args,
            contract,
          }),
      })
    })
  )

  return parsedInputs
}
