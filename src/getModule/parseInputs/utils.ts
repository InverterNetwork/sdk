import { parseUnits, stringToHex } from 'viem'
import { TupleFormattedAbiParameter, Extras } from '../../types'
import parse from './parse'

type TupleCaseParams = {
  input: TupleFormattedAbiParameter
  arg: any
  extras?: Extras
}

// TODO: Add error handling, for empty data
export const any = (arg: any) => stringToHex(JSON.stringify(arg))

// The case for tuple arguments
export const tuple = ({ input, arg, extras }: TupleCaseParams) => {
  const formattedTuple: any = {}
  // iterate over the components of the tuple template
  input.components.forEach((c, index) => {
    // try the name of the component, if it doesn't exist, use the index
    formattedTuple[c.name ?? `_${index}`] = parse(
      c,
      arg[c.name ?? index],
      extras
    )
  })

  return formattedTuple
}

// The case for tuple[] arguments
export const tupleArray = ({ arg, ...rest }: TupleCaseParams) =>
  arg.map((argI: any) => tuple({ arg: argI, ...rest }))

// Parse a string or number to a big int
export const stringNumber = (arg: any) => {
  if (Number(arg) * 0 === 0) return BigInt(arg)
  return arg
}

// The error case for decimals tag
export const decimals = (arg: any, extras?: Extras) => {
  if (!extras?.decimals) throw new Error('No decimals provided')
  return parseUnits(arg, extras.decimals)
}
