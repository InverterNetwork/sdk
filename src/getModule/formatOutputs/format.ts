import { Extras, FormattedAbiParameter } from '../../types'
import { tuple, tupleArray, decimals, any } from './utils'

export default function format(
  output: FormattedAbiParameter,
  res: any,
  extras?: Extras
): any {
  const { type } = output
  // These first two cases are for the recursive tuple types
  if (type === 'tuple') return tuple({ output, res, extras })
  if (type === 'tuple[]') return tupleArray({ output, res, extras })

  // If the output is not a tuple,

  // If it also has jsType property
  if ('jsType' in output) {
    const { jsType } = output

    // if the output is a string or a number, format it to a big int
    if (jsType === 'string') return String(res)

    // if the output is a string[], format each string to a big int
    if (jsType === 'string[]') return res.map((i: bigint) => String(i))
  }

  // if the output has a tag
  if ('tag' in output) {
    const { tag } = output
    // if the output has a tag
    if (tag === 'any') return any(res)

    if (tag === 'decimals') return decimals(res, extras)
  }

  // if all else fails, just return the initial res
  return res
}

export type TFormat = typeof format
