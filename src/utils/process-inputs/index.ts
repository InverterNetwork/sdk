import type { ProcessInputsParams, RequiredAllowances } from '@/types'
import d from 'debug'

import { bigIntReplacer } from '..'
import getTagCallback from './get-tag-callback'
import parse from './parse'

const debug = d('inverter:sdk:process-inputs')

export async function processInputs(params: ProcessInputsParams) {
  const requiredAllowances: RequiredAllowances[] = []

  const { extendedInputs, args, tagConfig } = params

  // parse the inputs
  const processedInputs = await Promise.all(
    extendedInputs.map(async (input, index) => {
      // get the argument of the same index
      const arg = Array.isArray(args) ? args[index] : args
      // if useTags is false, return the argument as is
      if (params.useTags === false) {
        return arg
      }
      // parse the input with the argument
      return await parse({
        input,
        arg,
        tagConfig,
        tagCallback: getTagCallback({ requiredAllowances, ...params }),
      })
    })
  )

  if (!!extendedInputs.length) {
    debug(
      `PROCESSED INPUTS for - ${extendedInputs.map((i) => i.name).join(',')}:`,
      JSON.parse(
        JSON.stringify(processedInputs, bigIntReplacer).replace(
          /"[^"]{100,}"/g,
          (match) => `"${match.slice(1, 101)}..."`
        )
      )
    )
  }

  return { processedInputs, requiredAllowances }
}
