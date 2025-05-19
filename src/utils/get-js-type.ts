import type { ExtendedAbiParameter } from '@inverter-network/abis'
import type { JsType } from '@/types'

export const getJsType = (
  parameter: ExtendedAbiParameter
): JsType | undefined => {
  const { type } = parameter

  // If the parameter has a tag, format it (this needs to come first)
  if ('tags' in parameter) {
    const { tags } = parameter

    if (tags?.includes('any')) return 'any'
  }

  // Simplify the type of the parameter to TypeScript types, into the jsType property
  if (type === 'bool') return 'boolean'
  if (type === 'bool[]') return 'boolean[]'
  if (type === 'address') return '0xstring'
  if (type === 'address[]') return '0xstring[]'

  // Regex to match uint and int types
  const intTypeMatch = /^u?int(\d*)(\[\])?$/.exec(type)

  if (intTypeMatch) {
    const [, bitSizeStr, isArray] = intTypeMatch
    const bitSize = bitSizeStr ? parseInt(bitSizeStr, 10) : 256 // Default to 256 bits if no size is specified

    if (bitSize <= 48) {
      return isArray ? 'number[]' : 'number'
    } else {
      return isArray ? 'numberString[]' : 'numberString'
    }
  }

  if (/^bytes(?!.*\]$)/.test(type)) return '0xstring'
  if (/^bytes.*\[\]$/.test(type)) return '0xstring[]'

  return undefined
}
