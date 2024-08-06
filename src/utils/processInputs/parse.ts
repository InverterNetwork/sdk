import { tuple, tupleArray } from './utils'
import { parseUnits, stringToHex } from 'viem'

import type { Extras, FormattedAbiParameter, TagCallback } from '../../types'

export const parseAny = (arg: any) => {
  try {
    stringToHex(JSON.stringify(arg))
  } catch {
    return '0x0'
  }
}

export const parseDecimals = (arg: any, decimals: number) =>
  parseUnits(arg, decimals)

export default async function parse({
  input,
  arg,
  extras,
  tagCallback,
}: {
  input: FormattedAbiParameter
  arg: any
  extras?: Extras
  tagCallback: TagCallback
}) {
  const { type } = input
  // These first two cases are for the recursive tuple types
  if (type === 'tuple') return await tuple({ input, arg, extras, tagCallback })
  if (type === 'tuple[]')
    return await tupleArray({ arg, input, extras, tagCallback })

  // if the input has a tag ( this has to come before the jsType check)
  if ('tags' in input && !!input.tags) {
    const { tags } = input
    if (tags.includes('any')) return parseAny(arg)

    const decimalsTag = tags.find((t) => t.startsWith('decimals'))
    if (!!decimalsTag) return await tagCallback('parseDecimals', tags, arg)
  }

  // if the input has a jsType property
  if ('jsType' in input) {
    const { jsType } = input

    // if the input is a string or a number, parse it to a big int
    if (jsType === 'numberString') return BigInt(arg)

    // if the input is a string[], parse each string to a big int
    if (jsType === 'numberString[]') return arg.map((i: string) => BigInt(i))
  }

  // if all else fails, just return the argument
  return arg
}

export type TParse = typeof parse
