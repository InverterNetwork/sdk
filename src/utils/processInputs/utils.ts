import { stringToHex } from 'viem'
import parse from './parse'
import type { ParseInputTupleCaseParams } from '@/types'

// The case for tuple arguments
export const tuple = async ({
  input,
  arg,
  extras,
  tagCallback,
}: ParseInputTupleCaseParams) => {
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
export const tupleArray = async ({ arg, ...rest }: ParseInputTupleCaseParams) =>
  await Promise.all(
    arg.map(async (argI: any) => await tuple({ arg: argI, ...rest }))
  )

export const parseAny = (arg: any) => {
  try {
    return stringToHex(JSON.stringify(arg))
  } catch {
    try {
      return stringToHex(arg)
    } catch {
      return arg
    }
  }
}
