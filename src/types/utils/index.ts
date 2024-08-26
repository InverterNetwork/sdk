import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import type { IfNever, IsEmptyObject } from 'type-fest-4'

export * from './primitive'
export * from './method'
export * from './blockchain'

export type OmitNever<T> = {
  [K in keyof T as IfNever<T[K], never, K>]: T[K]
}

export type EmptyObjectToNever<T> = IsEmptyObject<T> extends true ? never : T

export type GetDeploymentInputs<N extends ModuleName = ModuleName> =
  GetModuleData<N>['deploymentInputs']

export type FilterByPrefix<
  T,
  Prefix extends string,
> = T extends `${Prefix}${string}` ? T : never

export type FindStringByPart<
  T extends string,
  Part extends string,
> = T extends `${infer _Start}${Part}${infer _End}` ? T : never

/**
 * Utility type to remove multiple indexes from an array type.
 * @template T - The array type.
 * @template Indices - A union of indices to remove from the array type.
 */
export type RemoveIndexes<
  T extends readonly unknown[] | unknown[],
  Indices extends number[],
> = {
  [K in keyof T]: K extends `${Indices[number]}` ? never : T[K]
} extends infer U
  ? U extends (infer Item)[]
    ? Item[]
    : never
  : never

export type FlattenObjectValues<T> =
  T extends Record<string, infer U> ? (U extends any[] ? U[number] : U) : never
