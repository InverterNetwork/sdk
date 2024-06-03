import { FormattedAbiParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'
import { RequiredAllowances } from '../../types'
import getTagCallback, { GetTagCallbackParams } from './getTagCallback'

export type ParseInputsBaseParams = {
  extras?: Extras
  formattedInputs: readonly FormattedAbiParameter[]
  args: any
}

export type ParseInputsParams = Omit<GetTagCallbackParams, 'requiredAllowances'>

export default async function parseInputs(params: ParseInputsParams) {
  const requiredAllowances: RequiredAllowances[] = []

  const { formattedInputs, args, extras } = params

  // const inputs = formattedInputs as FormattedAbiParameter[]
  // parse the inputs
  const inputsWithDecimals = await Promise.all(
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

  return { inputsWithDecimals, requiredAllowances }
}
