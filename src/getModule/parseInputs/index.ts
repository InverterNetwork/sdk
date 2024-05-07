import { FormattedAbiParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'
import { PublicClient } from 'viem'

export default async function parseInputs(
  inputsProp: any,
  args: any,
  publicClient: PublicClient,
  extras?: Extras
) {
  const inputs = inputsProp as FormattedAbiParameter[]
  // parse the inputs

  const parsedInputs = inputs.map((_, index) => {
    // parse the input with the argument
    return parse(inputs, args, index, publicClient, extras)
  })

  return await Promise.all(parsedInputs)
}
