import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import type { IfNever, IsEmptyObject } from 'type-fest-4'

/**
 * Omit never values from an object type
 * @template T - The object type to omit never values from
 * @returns The object type with never values omitted
 */
export type OmitNever<T> = {
  [K in keyof T as IfNever<T[K], never, K>]: T[K]
}

/**
 * Convert an empty object to never
 * @template T - The object type to convert
 * @returns The object type converted to never
 */
export type EmptyObjectToNever<T> = IsEmptyObject<T> extends true ? never : T

/**
 * Get the deployment inputs for a module
 * @template N - The module name
 * @returns The deployment inputs for the module
 */
export type GetDeploymentInputs<N extends ModuleName = ModuleName> =
  GetModuleData<N>['deploymentInputs']

/**
 * Filter a string by a prefix
 * @template T - The string to filter
 * @template Prefix - The prefix to filter by
 * @returns The string filtered by the prefix
 */
export type FilterByPrefix<
  T,
  Prefix extends string,
> = T extends `${Prefix}${string}` ? T : never

/**
 * Find a string by a part
 * @template T - The string to find
 * @template Part - The part to find
 * @returns The string found by the part
 */
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

/**
 * Flatten the values of an object type
 * @template T - The object type to flatten
 * @returns The flattened values of the object type
 */
export type FlattenObjectValues<T> =
  T extends Record<string, infer U> ? (U extends any[] ? U[number] : U) : never
