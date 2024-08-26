import format from './format'

import type {
  ExtendedAbiParameter,
  Extras,
  GetMethodResponse,
  MethodKind,
} from '@/types'
import getTagCallback, { type GetTagCallbackParams } from './getTagCallback'

export type FormatOutputsBaseParams<
  T extends readonly ExtendedAbiParameter[] = readonly ExtendedAbiParameter[],
> = {
  formattedOutputs: T
  res: any
  extras?: Extras
}

export default async function formatOutputs<
  Kind extends MethodKind,
  T extends readonly ExtendedAbiParameter[],
>(props: GetTagCallbackParams<T>): Promise<GetMethodResponse<T, Kind>> {
  const { formattedOutputs, res, extras } = props

  // format the outputs
  const mapped = await Promise.all(
    formattedOutputs.map(async (output) => {
      const name = output.name
      // get the argument of the same index
      const selectedRes = (() => {
        // if name is defined and the result is an object
        if (!!name && res[name]) return res[name]
        // if name is defined and the result is an array
        if (!!name && isDefinedArray(output, res)) {
          return res[Number(name[1])]
        }
        // if name is not defined or the result is not an object or array
        return res
      })()

      // format the output with the argument
      const formatted = await format({
        output,
        res: selectedRes,
        extras,
        tagCallback: getTagCallback(props),
      })

      return formatted
    })
  )

  // return the formatted outputs, selecting the first one if there is only one
  return mapped.length === 1 ? mapped[0] : mapped
}

// check if the output is not a array type-
// and the result is an array, with a output name that starts with '_'
const isDefinedArray = ({ name, type }: ExtendedAbiParameter, res: any) =>
  !!name && !type.endsWith('[]') && Array.isArray(res) && name.startsWith('_')
