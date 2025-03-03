import { formatUnits, hexToString } from 'viem'
import format from './format'
import type { FormatOutputTupleCaseParams } from '@/types'

// The case for tuple outputs
export const tuple = async ({
  output,
  res,
  extras,
  tagCallback,
}: FormatOutputTupleCaseParams) => {
  const formattedTuple: any = {}

  await Promise.all(
    output.components.map(async (c, index) => {
      // try the name of the component, if it doesn't exist, use the index
      formattedTuple[c.name ?? `_${index}`] = await format({
        output: c,
        res: res[c.name ?? index],
        extras,
        tagCallback,
      })
    })
  )

  return formattedTuple
}

/**
 * The case for tuple[] outputs
 */
export const tupleArray = async ({
  res,
  ...rest
}: FormatOutputTupleCaseParams) =>
  await Promise.all(
    res.map(async (resI: any) => await tuple({ res: resI, ...rest }))
  )
/**
 * The case for decimal outputs
 */
export const formatDecimals = (value: bigint, decimals?: number) => {
  if (!decimals) throw new Error('No decimals provided')
  return formatUnits(value, decimals)
}

/** Tag: "any" tries to parse the result as JSON from hex, if it fails-
 * tries to parse the result as a string from hex, if it fails-
 * returns "Data is not a valid JSON string"
 */
export const formatAny = (res: any) => {
  try {
    return JSON.parse(hexToString(res))
  } catch {
    try {
      return hexToString(res)
    } catch {
      return res
    }
  }
}
