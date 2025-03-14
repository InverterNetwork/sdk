import format from './format'

import { isDefinedExtendedAbiMemberArray } from '@/types'
import type { FormatGetTagCallbackParams } from '@/types'
import getTagCallback from './get-tag-callback'

export async function formatOutputs(props: FormatGetTagCallbackParams) {
  const { extendedOutputs, res, tagConfig } = props

  // format the outputs
  const mapped = await Promise.all(
    extendedOutputs.map(async (output) => {
      const name = output.name
      // get the argument of the same index
      const selectedRes = (() => {
        // if name is defined and the result is an object
        if (!!name && res[name]) return res[name]
        // if name is defined and the result is an array
        if (!!name && isDefinedExtendedAbiMemberArray(output, res)) {
          return res[Number(name[1])]
        }
        // if name is not defined or the result is not an object or array
        return res
      })()

      // format the output with the argument
      const formatted = await format({
        output,
        res: selectedRes,
        tagConfig,
        tagCallback: getTagCallback(props),
      })

      return formatted
    })
  )

  // return the formatted outputs, selecting the first one if there is only one
  return mapped.length === 1 ? mapped[0] : mapped
}
