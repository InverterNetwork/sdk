import { parseUnits, stringToHex } from 'viem'
import { TupleFormattedAbiParameter, Extras } from '../../types'
import parse from './parse'
import { TagCallback } from '../../types'

type TupleCaseParams = {
  input: TupleFormattedAbiParameter
  arg: any
  extras?: Extras
  tagCallback: TagCallback
}

// The case for tuple arguments
export const tuple = async ({
  input,
  arg,
  extras,
  tagCallback,
}: TupleCaseParams) => {
  const formattedTuple: any = {}
  // iterate over the components of the tuple template
  await Promise.all(
    input.components.map(async (c, index) => {
      // try the name of the component, if it doesn't exist, use the index
      formattedTuple[c.name ?? `_${index}`] = await parse({
        input: c,
        arg: arg[c.name ?? index],
        extras,
        tagCallback,
      })
    })
  )

  return formattedTuple
}

// The case for tuple[] arguments
export const tupleArray = ({ arg, ...rest }: TupleCaseParams) =>
  arg.map((argI: any) => tuple({ arg: argI, ...rest }))

// TODO: Add error handling, for empty data
export const parseAny = (arg: any) => {
  try {
    stringToHex(JSON.stringify(arg))
  } catch {
    return '0x0'
  }
}

export const parseDecimals = (arg: any, decimals: number) =>
  parseUnits(arg, decimals)
