import { AbiStateMutability } from 'abitype'
import { FormattedAbiParameter, Extras, GetMethodResponse } from '../../types'
import format from './format'
import getTagCallback, { GetTagCallbackParams } from './getTagCallback'

export type FormatOutputsBaseParams<
  T extends readonly FormattedAbiParameter[] = readonly FormattedAbiParameter[],
> = {
  formattedOutputs: T
  res: any
  extras?: Extras
}

export default async function formatOutputs<
  StateMutability extends AbiStateMutability,
  Simulate extends boolean,
  T extends readonly FormattedAbiParameter[],
>(
  props: GetTagCallbackParams<T>
): Promise<GetMethodResponse<T, StateMutability, Simulate>> {
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
      return await format({
        output,
        res: selectedRes,
        extras,
        tagCallback: getTagCallback(props),
      })
    })
  )

  // return the formatted outputs, selecting the first one if there is only one
  return mapped.length === 1 ? mapped[0] : mapped
}

// check if the output is not a array type-
// and the result is an array, with a output name that starts with '_'
const isDefinedArray = ({ name, type }: FormattedAbiParameter, res: any) =>
  !!name && !type.endsWith('[]') && Array.isArray(res) && name.startsWith('_')
