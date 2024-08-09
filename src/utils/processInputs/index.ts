import parse from './parse'

import type {
  Extras,
  FormattedAbiParameter,
  MethodKind,
  RequiredAllowances,
} from '../../types'
import getTagCallback, { type GetTagCallbackParams } from './getTagCallback'

export type ProcessInputsBaseParams = {
  extras?: Extras
  formattedInputs: readonly FormattedAbiParameter[]
  args: any
  kind: MethodKind
}

export type ProcessInputsParams = Omit<
  GetTagCallbackParams,
  'requiredAllowances'
>

export default async function processInputs(params: ProcessInputsParams) {
  const requiredAllowances: RequiredAllowances[] = []

  const { formattedInputs, args, extras } = params

  // const inputs = formattedInputs as FormattedAbiParameter[]
  // parse the inputs
  const processedInputs = await Promise.all(
    formattedInputs.map(async (input, index) => {
      // get the argument of the same index
      const arg = Array.isArray(args) ? args[index] : args
      // parse the input with the argument
      return await parse({
        input,
        arg,
        extras,
        tagCallback: getTagCallback({ requiredAllowances, ...params }),
      })
    })
  )

  return { processedInputs, requiredAllowances }
}
