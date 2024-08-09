import parse from './parse'

import type {
  TupleFormattedAbiParameter,
  Extras,
  TagCallback,
} from '../../types'

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
export const tupleArray = async ({ arg, ...rest }: TupleCaseParams) =>
  await Promise.all(
    arg.map(async (argI: any) => await tuple({ arg: argI, ...rest }))
  )
