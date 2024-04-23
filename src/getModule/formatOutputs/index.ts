import { FormattedAbiParameter, Extras } from '../../types'
import format from './format'

export default function formattedOutputs<T>(
  outputsProp: any,
  res: any,
  extras?: Extras
): T {
  const outputs = outputsProp as FormattedAbiParameter[]

  // format the outputs
  const formattedOutputs = outputs.map((output) => {
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
    return format(output, selectedRes, extras)
  })

  // return the formatted outputs, selecting the first one if there is only one
  return formattedOutputs.length === 1 ? formattedOutputs[0] : formattedOutputs
}

// check if the output is not a array type-
// and the result is an array, with a output name that starts with '_'
const isDefinedArray = ({ name, type }: FormattedAbiParameter, res: any) =>
  !!name && !type.endsWith('[]') && Array.isArray(res) && name.startsWith('_')
