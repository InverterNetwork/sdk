import type { ParseInputsParams } from '@/types'
import { parseUnits } from 'viem'

import { getJsType } from '..'
import { parseAny, tuple, tupleArray } from './utils'

export const parseDecimals = (arg: any, decimals: number) =>
  parseUnits(arg, decimals)

export default async function parse({
  input,
  arg,
  tagConfig,
  tagCallback,
}: ParseInputsParams) {
  const { type } = input
  // These first two cases are for the recursive tuple types
  if (type === 'tuple')
    return await tuple({ input, arg, tagConfig, tagCallback })
  if (type === 'tuple[]')
    return await tupleArray({ arg, input, tagConfig, tagCallback })

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
