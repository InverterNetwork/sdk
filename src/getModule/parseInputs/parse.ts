import { Extras, FormattedParameter } from '../../types'
import tag from './tag'

type TupleInput = Extract<
  FormattedParameter,
  {
    type: 'tuple' | 'tuple[]'
  }
>

export default function parse(
  input: FormattedParameter,
  arg: any,
  extras?: Extras
): any {
  // if the input has a tag
  if ('tag' in input) {
    if (input.tag === 'any') return tag.any(arg)

    if (input.tag === 'decimals') return decimals(arg, extras)
  }

  // if the input is a string or a number, parse it to a big int
  if (['string', 'number'].includes(input.type)) stringNumber(arg)

  // if the input is a string[], parse each string to a big int
  if (input.type === 'string[]') return arg.map((i: string) => stringNumber(i))

  // the tuple type is a special case
  if (input.type === 'tuple') return tuple(input, arg, extras)

  // the tuple[] type is a special case, too
  if (input.type === 'tuple[]')
    arg.map((argI: any) => tuple(input, argI, extras))

  // if all else fails, just return the argument
  return arg
}

const tuple = (input: TupleInput, arg: any, extras?: Extras) => {
  const formattedTuple: any = {}
  // iterate over the components of the tuple template
  input.components.forEach((c) => {
    formattedTuple[c.name] = parse(c, arg[c.name], extras)
  })

  return formattedTuple
}

const stringNumber = (arg: any) => {
  if (Number(arg) * 0 === 0) return BigInt(arg)
  return arg
}

const decimals = (arg: any, extras?: Extras) => {
  if (!extras?.decimals) throw new Error('No decimals provided')
  return tag.decimals(arg, extras.decimals)
}
