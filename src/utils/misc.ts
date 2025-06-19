import type { Entries } from 'type-fest-4'

export const getEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as any

export const getValues = <T extends object>(obj: T): T[keyof T][] =>
  Object.values(obj)

// Custom replacer function to handle BigInt serialization
export const bigIntReplacer = (_key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  return value
}
