import { parseUnits, stringToHex } from 'viem'

const any = (arg: any) => stringToHex(JSON.stringify(arg))

const decimals = (value: string, decimals: number) =>
  parseUnits(value, decimals)

export default {
  any,
  decimals,
}
