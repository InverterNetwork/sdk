import parse from './parse'

import type { Extras, MethodKind, RequiredAllowances } from '@/types'
import getTagCallback, { type GetTagCallbackParams } from './getTagCallback'
import type { ExtendedAbiParameter } from '@inverter-network/abis'

export type ProcessInputsBaseParams = {
  extras?: Extras
  formattedInputs: readonly ExtendedAbiParameter[]
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
