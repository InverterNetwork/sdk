import { parseUnits, stringToHex } from 'viem'
import { FormattedParameter } from '../types/parameter'
import { Extras } from '../types/base'

export default function parseInputs(
  inputsProp: any,
  argsProp: any,
  extras?: Extras
) {
  const inputs = inputsProp as FormattedParameter[],
    args = argsProp as any[]
  const parse = (
    input: (typeof inputs)[number],
    arg: (typeof args)[number]
  ): any => {
    const anyString = (arg: any) => stringToHex(JSON.stringify(arg))
    const decimal = (value: string, decimals: number) =>
      parseUnits(value, decimals)

    // if the input has a tag
    if ('tag' in input) {
      if (input.tag === 'any(string)') return anyString(arg)

      if (input.tag === 'decimal') {
        if (!extras?.decimals) throw new Error('No decimals provided')
        return decimal(arg, extras.decimals)
      }
    }

    // if the input is a string or a number, parse it to a big int
    if (['string', 'number'].includes(input.type)) {
      if (Number(arg) * 0 === 0) return BigInt(arg)
      return arg
    }

    // if the input is a string[], parse each string to a big int
    if (input.type === 'string[]')
      return arg.map((i: string) => {
        if (Number(arg) * 0 === 0) return BigInt(i)
        return i
      })

    // the tuple type is a special case
    if (input.type === 'tuple') {
      const formattedTuple: any = {}
      // iterate over the components of the tuple template
      input.components.forEach((c) => {
        formattedTuple[c.name] = parse(c, arg[c.name])
      })

      return formattedTuple
    }

    // the tuple[] type is a special case, too
    if (input.type === 'tuple[]') {
      // iterate over the array of tuples at the argument
      return arg.map((a: any) => {
        const formattedTuple: any = {}
        // iterate over the components of the tuple template
        input.components.forEach((c) => {
          // parse the component with the argument
          formattedTuple[c.name] = parse(c, a[c.name])
        })
        return formattedTuple
      })
    }

    // if all else fails, just return the argument
    return arg
  }

  // parse the inputs
  const parsedInputs = inputs.map((input, index) => {
    // get the argument of the same index
    const arg = Array.isArray(args) ? args[index] : args
    // parse the input with the argument
    return parse(input, arg)
  })

  return parsedInputs
}
