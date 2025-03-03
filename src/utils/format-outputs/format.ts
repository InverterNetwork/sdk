import { getJsType } from '@/utils'
import { tuple, tupleArray, formatAny } from './utils'

import type { FormatOutputsParams } from '@/types'

export default async function format({
  output,
  res,
  tagConfig,
  tagCallback,
}: FormatOutputsParams) {
  const { type } = output
  // These first two cases are for the recursive tuple types
  if (type === 'tuple')
    return await tuple({ output, res, tagConfig, tagCallback })
  if (type === 'tuple[]')
    return await tupleArray({ output, res, tagConfig, tagCallback })

  // If the output is not a tuple,

  // if the output has a tag ( this has to come before the jsType check)
  if ('tags' in output && !!output.tags) {
    const { tags } = output

    const decimalsTag = tags.find((t) => t.startsWith('decimals'))
    if (!!decimalsTag) return await tagCallback('formatDecimals', tags, res)
  }

  switch (getJsType(output)) {
    case 'any':
      return formatAny(res)
    case 'numberString':
      return String(res)
    case 'numberString[]':
      return res.map((i: bigint) => String(i))
    case 'number':
      return Number(res)
    case 'number[]':
      return res.map((i: bigint) => Number(i))
  }

  // if all else fails, just return the initial res
  return res
}

export type TFormat = typeof format
