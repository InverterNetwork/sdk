import { FormattedParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import format from './format'

export default function formatOutputs(
  outputsProp: any,
  res: any,
  extras?: Extras
) {
  const outputs = outputsProp as FormattedParameter[]

  // format the outputs
  const formattedOutputs = outputs.map((output) => {
    const name = output.name
    // get the argument of the same index
    const selectedRes = (() => {
      if (res[name]) return res[name]
      if (isDefinedArray(output, res)) {
        return res[Number(name[1])]
      }
      return res
    })()
    // format the output with the argument
    return format(output, selectedRes, extras)
  })

  return formattedOutputs.length === 1 ? formattedOutputs[0] : formattedOutputs
}

// check if the output is not a array type-
// and the result is an array, with a output name that starts with '_'
const isDefinedArray = ({ name, type }: FormattedParameter, res: any) =>
  !type.endsWith('[]') && Array.isArray(res) && name.startsWith('_')