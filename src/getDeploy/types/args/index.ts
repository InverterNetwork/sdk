import { ModuleName } from '@inverter-network/abis'
import { OrchestratorArgs } from './static'
import { RequestedModules } from '../requested'
import {
  OmitNever,
  GetDeploymentArgs,
  EmptyObjectToNever,
} from '../../../types'
import { FormattedParameterToPrimitiveType } from '../../../types/utils/parameter/primitive'
import { IsEmptyObject, Simplify } from 'type-fest'
export * from './static'

// User arguments per module name and version
export type UserModuleArg<
  N extends ModuleName = ModuleName,
  V extends string = string,
  CD = GetDeploymentArgs<N, V>['configData'][number],
> = EmptyObjectToNever<{
  // @ts-expect-error - TS cant resolve name
  [PN in CD['name']]: FormattedParameterToPrimitiveType<
    Extract<CD, { name: PN }>
  >
}>

type UserOptionalArgsBase<T extends RequestedModules['optionalModules']> =
  T extends undefined
    ? never
    : {
        [K in NonNullable<T>[number]['name']]: UserModuleArg<
          K,
          Extract<NonNullable<T>[number], { name: K }>['version']
        >
      }

export type UserOptionalArgs<
  T extends RequestedModules['optionalModules'],
  R = UserOptionalArgsBase<T>,
> = EmptyObjectToNever<
  OmitNever<{
    [K in keyof R]: IsEmptyObject<R[K]> extends true ? never : R[K]
  }>
>

export type UserArgs<T extends RequestedModules = RequestedModules> = Simplify<
  OmitNever<{
    orchestrator: OrchestratorArgs
    fundingManager: UserModuleArg<
      T['fundingManager']['name'],
      T['fundingManager']['version']
    >
    authorizer: UserModuleArg<
      T['authorizer']['name'],
      T['authorizer']['version']
    >
    paymentProcessor: UserModuleArg<
      T['paymentProcessor']['name'],
      T['paymentProcessor']['version']
    >
    optionalModules: UserOptionalArgs<T['optionalModules']>
  }>
>
