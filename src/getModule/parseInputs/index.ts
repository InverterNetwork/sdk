import { FormattedParameter } from '../../types/parameter'
import { Extras } from '../../types/base'
import parse from './parse'

export default function parseInputs(
  inputsProp: any,
  argsProp: any,
  extras?: Extras
) {
  const inputs = inputsProp as FormattedParameter[],
    args = argsProp as any[]

  // parse the inputs
  const parsedInputs = inputs.map((input, index) => {
    // get the argument of the same index
    const arg = Array.isArray(args) ? args[index] : args
    // parse the input with the argument
    return parse(input, arg, extras)
  })

  return parsedInputs
}
