import { formatUnits, hexToString } from 'viem'
import { TupleFormattedAbiParameter, Extras } from '../../types'
import format from './format'

type TupleCaseParams = {
  output: TupleFormattedAbiParameter
  res: any
  extras?: Extras
}

// Tag: "any" tries to parse the result as JSON from hex, if it fails-
// tries to parse the result as a string from hex, if it fails-
// returns "Data is not a valid JSON string"
export const any = (res: any) => {
  try {
    return JSON.parse(hexToString(res))
  } catch {
    try {
      return hexToString(res)
    } catch {
      return 'Data is not a valid JSON string'
    }
  }
}

// The case for tuple outputs
export const tuple = ({ output, res, extras }: TupleCaseParams) => {
  const formattedTuple: any = {}

  output.components.forEach((c) => {
    formattedTuple[c.name] = format(c, res[c.name], extras)
  })

  return formattedTuple
}

// The case for tuple[] outputs
export const tupleArray = ({ res, ...rest }: TupleCaseParams) =>
  res.map((resI: any) => tuple({ res: resI, ...rest }))

// The case for decimal outputs
export const decimals = (value: bigint, extras?: Extras) => {
  if (!extras?.decimals) throw new Error('No decimals provided')
  return formatUnits(value, extras.decimals)
}
