import { formatUnits, hexToString } from 'viem'

// Tag: "any" tries to parse the result as JSON from hex, if it fails-
// tries to parse the result as a string from hex, if it fails-
// returns "Data is not a valid JSON string"
const any = (res: any) => {
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
// Tag: "decimals" formats the result as a string with the provided decimals
const decimals = (value: bigint, decimals: number) =>
  formatUnits(value, decimals)

export default {
  any,
  decimals,
}
