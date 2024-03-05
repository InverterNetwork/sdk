import { formatUnits, hexToString } from 'viem'
import { FormattedParameter } from '../types/parameter'
import { Extras } from '../types/base'

export default function formatOutputs(
  outputsProp: any,
  res: any,
  extras?: Extras
) {
  const outputs = outputsProp as FormattedParameter[]

  const format = (output: (typeof outputs)[number], res: any): any => {
    const anyString = (res: any) => {
      try {
        return JSON.parse(hexToString(res))
      } catch {
        return 'Data is not a valid JSON string'
      }
    }
    const decimal = (value: bigint, decimals: number) =>
      formatUnits(value, decimals)

    // if the output has a tag
    if ('tag' in output) {
      if (output.tag === 'any(string)') return anyString(res)

      if (output.tag === 'decimal') {
        if (!extras?.decimals) throw new Error('No decimals provided')
        return decimal(res, extras.decimals)
      }
    }

    // if the output is a string or a number, format it to a big int
    if (output.type === 'string') return String(res)
    if (output.type === 'number') return Number(res)

    // if the output is a string[], format each string to a big int
    if (output.type === 'string[]') return res.map((i: bigint) => String(i))

    if (output.type === 'tuple') {
      const formattedTuple: any = {}

      output.components.forEach((c) => {
        formattedTuple[c.name] = format(c, res[c.name])
      })

      return formattedTuple
    }

    if (output.type === 'tuple[]') {
      const mapped = res.map((a: any) => {
        const formattedTuple: any = {}

        output.components.forEach((c) => {
          formattedTuple[c.name] = format(c, a[c.name])
        })

        return formattedTuple
      })

      return mapped
    }

    // if all else fails, just return the argument
    return res
  }

  // format the outputs
  const formattedOutputs = outputs.map((output) => {
    const name = output.name
    // get the argument of the same index
    const selectedRes = res?.[name] ?? res
    // format the output with the argument
    return format(output, selectedRes)
  })

  return formattedOutputs.length === 1 ? formattedOutputs[0] : formattedOutputs
}
