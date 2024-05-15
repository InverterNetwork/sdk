import { Tag } from '@inverter-network/abis'
import { Extras, FormattedAbiParameter } from '../../types'
import { tuple, tupleArray, stringNumber, any } from './utils'

export type DecimalsCallback = (decimalsTag: Tag) => Promise<bigint>

export default async function parse({
  input,
  arg,
  extras,
  decimalsCallback,
}: {
  input: FormattedAbiParameter
  arg: any
  extras?: Extras
  decimalsCallback: DecimalsCallback
}) {
  const { type } = input
  // These first two cases are for the recursive tuple types
  if (type === 'tuple')
    return await tuple({ input, arg, extras, decimalsCallback })
  if (type === 'tuple[]')
    return await tupleArray({ arg, input, extras, decimalsCallback })

  // if the input has a tag ( this has to come before the jsType check)
  if ('tags' in input) {
    const { tags } = input
    if (tags?.includes('any')) return any(arg)

    const decimalsTag = tags?.find((t) => t.startsWith('decimals'))
    if (!!decimalsTag) return await decimalsCallback(decimalsTag)
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
