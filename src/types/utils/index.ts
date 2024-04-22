export * from './parameter'
export * from './method'

export type Pretty<T> = { [K in keyof T]: T[K] } & unknown
