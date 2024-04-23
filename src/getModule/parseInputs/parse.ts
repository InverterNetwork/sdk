import { Extras, FormattedAbiParameter } from '../../types'
import { tuple, tupleArray, stringNumber, decimals, any } from './utils'

export default function parse(
  input: FormattedAbiParameter,
  arg: any,
  extras?: Extras
): any {
  const { type } = input
  // These first two cases are for the recursive tuple types
  if (type === 'tuple') return tuple({ input, arg, extras })
  if (type === 'tuple[]') return tupleArray({ arg, input, extras })

  // if the input has a tag
  if ('tag' in input) {
    const { tag } = input
    if (tag === 'any') return any(arg)

    if (tag === 'decimals') return decimals(arg, extras)
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
