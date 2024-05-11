import { ModuleName } from '@inverter-network/abis'
import { OrchestratorArgs } from './static'
import { RequestedModules } from '../requested'
import {
  OmitNever,
  GetDeploymentInputs,
  EmptyObjectToNever,
} from '../../../types'
import { FormattedParameterToPrimitiveType } from '../../../types/utils/parameter/primitive'
import { IsEmptyObject, Simplify } from 'type-fest'
export * from './static'

// User arguments per module name and version
export type GetUserModuleArg<
  N extends ModuleName = ModuleName,
  CD = GetDeploymentInputs<N>['configData'][number],
> = EmptyObjectToNever<{
  // @ts-expect-error - TS cant resolve name
  [PN in CD['name']]: FormattedParameterToPrimitiveType<
    Extract<CD, { name: PN }>
  >
}>

type GetUserOptionalArgsBase<T extends RequestedModules['optionalModules']> =
  T extends undefined
    ? never
    : {
        [K in NonNullable<T>[number]['name']]: GetUserModuleArg<K>
      }

export type GetUserOptionalArgs<
  T extends RequestedModules['optionalModules'],
  R = GetUserOptionalArgsBase<T>,
> = EmptyObjectToNever<
  OmitNever<{
    [K in keyof R]: IsEmptyObject<R[K]> extends true ? never : R[K]
  }>
>

export type GetUserArgs<T extends RequestedModules = RequestedModules> =
  Simplify<
    OmitNever<{
      orchestrator: OrchestratorArgs
      fundingManager: GetUserModuleArg<T['fundingManager']['name']>
      authorizer: GetUserModuleArg<T['authorizer']['name']>
      paymentProcessor: GetUserModuleArg<T['paymentProcessor']['name']>
      optionalModules: GetUserOptionalArgs<T['optionalModules']>
    }>
  >
