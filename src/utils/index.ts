import type { Entries } from 'type-fest-4'

export * from './get-js-type'
export * from './handle-error'
export * from './constants'
export * from './process-inputs'
export * from './format-outputs'
export * from './external'

export { default as tagProcessor } from './tag-processor'
export { default as handleOptions } from './handle-options'

export const getEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as any

export const getValues = <T extends object>(obj: T): T[keyof T][] =>
  Object.values(obj)
