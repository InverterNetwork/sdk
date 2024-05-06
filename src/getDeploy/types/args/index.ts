import { GetModuleVersion, ModuleName } from '@inverter-network/abis'
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
  V extends GetModuleVersion<N> = GetModuleVersion<N>,
  CD = GetDeploymentArgs<N, V>['configData'][number],
> = EmptyObjectToNever<{
  // @ts-expect-error - TS doesn't resolve name and type
  [PN in CD['name']]: FormattedParameterToPrimitiveType<
    Extract<CD, { name: PN }>
  >
}>

type UserOptionalArgsBase<T extends RequestedModules['optionalModules']> =
  T extends infer U
    ? U extends RequestedModules['optionalModules']
      ? {
          [K in NonNullable<U>[number]['name']]: UserModuleArg<
            K,
            // @ts-expect-error - TS doesn't resolve version
            Extract<NonNullable<U>[number], { name: K }>['version']
          >
        }
      : never
    : never

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
      // @ts-expect-error - TS doesn't resolve version
      T['fundingManager']['version']
    >
    authorizer: UserModuleArg<
      T['authorizer']['name'],
      // @ts-expect-error - TS doesn't resolve version
      T['authorizer']['version']
    >
    paymentProcessor: UserModuleArg<
      T['paymentProcessor']['name'],
      // @ts-expect-error - TS doesn't resolve version
      T['paymentProcessor']['version']
    >
    optionalModules: UserOptionalArgs<T['optionalModules']>
  }>
>
