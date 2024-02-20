import { isAddress, parseUnits, stringToHex } from 'viem'
import { FormatterValues, FormatterTagValues } from '../types/base'
import { PreparedInput } from '../types/output'
import { isString } from '../types/guards'

export default function parseInput({
  input,
  value,
  tagValue,
}: {
  input: PreparedInput
  value: FormatterValues
  tagValue?: FormatterTagValues
}) {
  switch (input.type) {
    case 'uint256':
      if (isString(value)) {
        if (input.tag === 'decimal' && !!tagValue)
          return parseUnits(value, tagValue)
        else BigInt(value)
      }
    case 'address':
      if (isString(value) && isAddress(value)) return value
    case 'bytes':
      if (input.tag === 'any(string)') return stringToHex(JSON.stringify(value))
    default:
      throw new Error("Invalid input or tag value, can't parse input.")
  }
}
