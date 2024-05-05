export * from './parameter'
export * from './method'

// prettier-ignore
export type FilteredKeys<T> = {[P in keyof T]: T[P] extends never ? never : P}[keyof T]
// prettier-ignore
export type ExcludeNeverFields<O> = {[K in FilteredKeys<O>]: O[K]}
