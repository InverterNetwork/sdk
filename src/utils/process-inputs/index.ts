import type { ProcessInputsParams, RequiredAllowances } from '@/types'

import getTagCallback from './get-tag-callback'
import parse from './parse'

export async function processInputs(params: ProcessInputsParams) {
  const requiredAllowances: RequiredAllowances[] = []

  const { extendedInputs, args, tagConfig } = params

  // parse the inputs
  const processedInputs = await Promise.all(
    extendedInputs.map(async (input, index) => {
      // get the argument of the same index
      const arg = Array.isArray(args) ? args[index] : args
      // parse the input with the argument
      return await parse({
        input,
        arg,
        tagConfig,
        tagCallback: getTagCallback({ requiredAllowances, ...params }),
      })
    })
  )

  return { processedInputs, requiredAllowances }
}
