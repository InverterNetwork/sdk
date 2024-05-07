import { PublicClient } from 'viem'
import { Extras, FormattedAbiParameter } from '../../types'
import { tuple, tupleArray, stringNumber, decimals, any } from './utils'
import { DECIMALS_ABI } from '../../getDeploy/constants'

export default async function parse(
  inputs: FormattedAbiParameter[],
  args: any,
  index: any,
  publicClient: PublicClient,
  extras?: Extras
): Promise<any> {
  const input = inputs[index]
  const arg = Array.isArray(args) ? args[index] : args

  const { type } = input
  // These first two cases are for the recursive tuple types
  if (type === 'tuple') return tuple({ input, arg, extras })
  if (type === 'tuple[]') return tupleArray({ arg, input, extras })

  // if the input has a tag ( this has to come before the jsType check)
  if ('tags' in input) {
    const { tags } = input
    if (tags?.includes('any')) return any(arg)

    const decimalsTag = tags?.find((t) => t.startsWith('decimals'))
    if (decimalsTag) {
      const [, source, location, name] = decimalsTag?.split(':')

      let decimalsValue = 18 // default decimals
      if (source === 'internal') {
        if (location === 'exact') {
          decimalsValue = args[inputs.findIndex((input) => input.name === name)]
        } else if (location === 'indirect') {
          // get decimals from contract
          const address = args[inputs.findIndex((input) => input.name === name)]
          const { readContract } = publicClient
          decimalsValue = (await readContract({
            address,
            abi: DECIMALS_ABI,
            functionName: 'decimals',
          })) as number
        }
      }

      return decimals(arg, { ...extras, decimals: decimalsValue })
    }
  }

  // if the input has a jsType property
  if ('jsType' in input) {
    const { jsType } = input

    // if the input is a string or a number, parse it to a big int
    if (jsType === 'string') return stringNumber(arg)

    // if the input is a string[], parse each string to a big int
    if (input.type === 'string[]')
      return arg.map((i: string) => stringNumber(i))
  }

  // if all else fails, just return the argument
  return arg
}

export type TParse = typeof parse
