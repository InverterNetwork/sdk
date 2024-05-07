import { GetModuleData, ModuleName } from '@inverter-network/abis'
import { IfNever, IsEmptyObject } from 'type-fest'

export * from './parameter'
export * from './method'
export * from './blockchain'

export type OmitNever<T> = {
  [K in keyof T as IfNever<T[K], never, K>]: T[K]
}

export type EmptyObjectToNever<T> = IsEmptyObject<T> extends true ? never : T

export type GetDeploymentArgs<
  N extends ModuleName = ModuleName,
  V extends string = string,
> = GetModuleData<N, V>['deploymentArgs']
