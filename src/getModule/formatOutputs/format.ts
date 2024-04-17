import { Extras, FormattedParameter } from '../../types'
import tag from './tag'

type TupleOutput = Extract<
  FormattedParameter,
  {
    type: 'tuple' | 'tuple[]'
  }
>

export default function format(
  o: FormattedParameter,
  res: any,
  extras?: Extras
): any {
  // if the output has a tag
  if ('tag' in o) {
    if (o.tag === 'any') return tag.any(res)

    if (o.tag === 'decimals') return decimals(res, extras)
  }

  // if the output is a string or a number, format it to a big int
  if (o.type === 'string') return String(res)
  if (o.type === 'number') return Number(res)

  // if the output is a string[], format each string to a big int
  if (o.type === 'string[]') return res.map((i: bigint) => String(i))

  if (o.type === 'tuple') return tuple(o, res, extras)

  if (o.type === 'tuple[]') return tupleArray(o, res, extras)

  // if all else fails, just return the argument
  return res
}

export type TFormat = typeof format

// The case for tuple outputs
const tuple = (o: TupleOutput, res: any, extras?: Extras) => {
  const formattedTuple: any = {}

  o.components.forEach((c) => {
    formattedTuple[c.name] = format(c, res[c.name], extras)
  })

  return formattedTuple
}

// The case for tuple[] outputs
const tupleArray = (o: TupleOutput, res: any, extras?: Extras) =>
  res.map((resI: any) => tuple(o, resI, extras))

// The case for decimal outputs
const decimals = (res: any, extras?: Extras) => {
  if (!extras?.decimals) throw new Error('No decimals provided')
  return tag.decimals(res, extras.decimals)
}
