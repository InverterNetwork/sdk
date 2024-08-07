import type { GetModuleData, ModuleName } from '@inverter-network/abis'
import type { IfNever, IsEmptyObject } from 'type-fest-4'

export * from './parameter'
export * from './method'
export * from './blockchain'

export type OmitNever<T> = {
  [K in keyof T as IfNever<T[K], never, K>]: T[K]
}

export type EmptyObjectToNever<T> = IsEmptyObject<T> extends true ? never : T

export type GetDeploymentInputs<N extends ModuleName = ModuleName> =
  GetModuleData<N>['deploymentInputs']
