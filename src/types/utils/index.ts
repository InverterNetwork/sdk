export * from './parameter'
export * from './method'

// Used for collapsing type into the final type-
// rather than displaying the type pre compilation
export type Pretty<T> = { [K in keyof T]: T[K] } & unknown
