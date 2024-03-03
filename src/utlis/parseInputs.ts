import { parseUnits, stringToHex } from 'viem'
import { FormattedParameter } from '../types/parameter'

export default function parseInputs(inputsProp: any, argsProps: any) {
  const inputs = inputsProp as FormattedParameter[],
    args = argsProps as any[]
  const parse = (
    input: (typeof inputs)[number],
    arg: (typeof args)[number]
  ): any => {
    const anyString = (arg: any) => stringToHex(JSON.stringify(arg))
    const decimal = (value: any, decimals: any) => parseUnits(value, decimals)

    // if the input has a tag
    if ('tag' in input) {
      if (input.tag === 'any(string)') return anyString(arg)

      if (input.tag === 'decimal') return decimal(arg.value, arg.decimals)
    }

    // if the input is a string or a number, parse it to a big int
    if (['string', 'number'].includes(input.type)) return BigInt(arg)

    // if the input is a string[], parse each string to a big int
    if (input.type === 'string[]') return arg.map((i: string) => BigInt(i))

    // the tuple[] type is a special case
    if (input.type === 'tuple[]') {
      // initialize the tuple
      const parsedTuple: any = {}
      // iterate over the arguments
      return arg.map((a: any) => {
        // iterate over the components of the tuple constructor
        input.components.forEach((c) => {
          // parse the tuple and assign the parsed value to the constructor name
          parsedTuple[c.name] = parse(c, a[c.name])
        })

        return parsedTuple
      })
    }

    // if all else fails, just return the argument
    return arg
  }

  // parse the inputs
  const parsedInputs = inputs.map((input, index) => {
    // get the argument of the same index
    const arg = args[index]
    // parse the input with the argument
    return parse(input, arg)
  })

  return parsedInputs
}
