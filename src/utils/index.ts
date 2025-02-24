import type { Entries } from 'type-fest-4'

export * from './getJsType'
export * from './handleError'
export * from './constants'
export * from './processInputs'
export * from './formatOutputs'
export * from './external'

export { default as tagProcessor } from './tagProcessor'
export { default as handleOptions } from './handleOptions'

export const getEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as any

export const getValues = <T extends object>(obj: T): T[keyof T][] =>
  Object.values(obj)
