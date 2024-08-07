import type { ExtendedAbiParameter } from '@inverter-network/abis'
import type { JsType } from '../types'
import type { Entries } from 'type-fest-4'

export const getJsType = (
  parameter: ExtendedAbiParameter
): JsType | undefined => {
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
  if (/^u?int(?!.*\]$)/.test(type)) return 'numberString'
  if (/^u?int.*\[\]$/.test(type)) return 'numberString[]'
  if (/^bytes(?!.*\]$)/.test(type)) return '0xstring'
  if (/^bytes.*\[\]$/.test(type)) return '0xstring[]'

  return
}

export const getEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as any

export const getValues = <T extends object>(obj: T): T[keyof T][] =>
  Object.values(obj)
