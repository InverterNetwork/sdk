import { tuple, tupleArray } from './utils'
import { parseUnits, stringToHex } from 'viem'

import type { Extras, ExtendedAbiParameter, TagCallback } from '@/types'
import { getJsType } from '..'

export const parseAny = (arg: any) => {
  try {
    return stringToHex(JSON.stringify(arg))
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
  input: ExtendedAbiParameter
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

    const decimalsTag = tags.find((t) => t.startsWith('decimals'))
    if (!!decimalsTag) return await tagCallback('parseDecimals', tags, arg)
  }

  switch (getJsType(input)) {
    case 'any':
      return parseAny(arg)
    case 'numberString':
      return BigInt(arg)
    case 'numberString[]':
      return arg.map((i: string) => BigInt(i))
    case 'number':
      return Number(arg)
    case 'number[]':
      return arg.map((i: number) => Number(i))
  }

  // if all else fails, just return the argument
  return arg
}

export type TParse = typeof parse
