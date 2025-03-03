import { stringToHex } from 'viem'
import parse from './parse'
import type { ParseInputTupleCaseParams } from '@/types'

/**
 * @description The case for tuple arguments
 * @param input - The input
 * @param arg - The argument
 * @param tagConfig - The tag config
 * @param tagCallback - The tag callback
 */
export const tuple = async ({
  input,
  arg,
  tagConfig,
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
        tagConfig,
        tagCallback,
      })
    })
  )

  return formattedTuple
}

/**
 * @description The case for tuple[] arguments
 * @param arg - The argument
 * @param rest - The rest of the parameters
 * @returns The formatted tuple
 */
export const tupleArray = async ({ arg, ...rest }: ParseInputTupleCaseParams) =>
  await Promise.all(
    arg.map(async (argI: any) => await tuple({ arg: argI, ...rest }))
  )

/**
 * @description The case for any tag argument
 * @param arg - The argument
 * @returns The formatted argument
 */
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
