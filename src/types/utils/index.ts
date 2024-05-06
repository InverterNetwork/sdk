import {
  GetModuleData,
  GetModuleVersion,
  ModuleName,
} from '@inverter-network/abis'
import { IfNever, IsEmptyObject } from 'type-fest'

export * from './parameter'
export * from './method'

// prettier-ignore
export type OmitNever<T> = {
  [K in keyof T as IfNever<T[K], never, K>]: T[K]
};

export type EmptyObjectToNever<T> = IsEmptyObject<T> extends true ? never : T

export type GetDeploymentArgs<
  N extends ModuleName = ModuleName,
  V extends GetModuleVersion<N> = GetModuleVersion<N>,
> = GetModuleData<N, V>['deploymentArgs']
