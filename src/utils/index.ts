import { ExtendedAbiParameter } from '@inverter-network/abis'

export const getJsType = (parameter: ExtendedAbiParameter) => {
  const { type } = parameter

  // If the parameter has a tag, format it ( this needs to come first )
  if ('tags' in parameter) {
    const { tags } = parameter

    if (tags?.includes('any')) return 'any'
  }

  // Simplify the type of the parameter, to typescript types, into the jsType property
  if (type === 'bool') return 'boolean'
  if (type === 'bool[]') return 'boolean[]'
  if (type === 'address') return '0xstring'
  if (type === 'address[]') return '0xstring[]'
  if (/^u?int(?!.*\]$)/.test(type)) return 'string'
  if (/^u?int.*\[\]$/.test(type)) return 'string[]'
  if (/^bytes(?!.*\]$)/.test(type)) return '0xstring'
  if (/^bytes.*\[\]$/.test(type)) return '0xstring[]'
}
