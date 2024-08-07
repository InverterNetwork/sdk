import { tuple, tupleArray, formatAny } from './utils'

import type { Extras, FormattedAbiParameter, TagCallback } from '../../types'

export default async function format({
  output,
  res,
  extras,
  tagCallback,
}: {
  output: FormattedAbiParameter
  res: any
  extras?: Extras
  tagCallback: TagCallback
}) {
  const { type } = output
  // These first two cases are for the recursive tuple types
  if (type === 'tuple') return await tuple({ output, res, extras, tagCallback })
  if (type === 'tuple[]')
    return await tupleArray({ output, res, extras, tagCallback })

  // If the output is not a tuple,

  // if the output has a tag ( this has to come before the jsType check)
  if ('tags' in output && !!output.tags) {
    const { tags } = output
    // if the output has a tag
    if (tags.includes('any')) return formatAny(res)

    const decimalsTag = tags.find((t) => t.startsWith('decimals'))
    if (!!decimalsTag) return await tagCallback('formatDecimals', tags, res)
  }

  // If it also has jsType property
  if ('jsType' in output) {
    const { jsType } = output

    // if the output is a numberString, fromat res into string
    if (jsType === 'numberString') return String(res)

    // if the output is a numberString[], format each res to a string
    if (jsType === 'numberString[]') return res.map((i: bigint) => String(i))
  }

  // if all else fails, just return the initial res
  return res
}

export type TFormat = typeof format
