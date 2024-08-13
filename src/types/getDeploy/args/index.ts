import type { ModuleName } from '@inverter-network/abis'
import type { IssuanceTokenArgs, OrchestratorArgs } from './static'
import type {
  OmitNever,
  GetDeploymentInputs,
  EmptyObjectToNever,
  FormatParameter,
  FormattedParameterToPrimitiveType,
  RequestedModules,
  FactoryType,
} from '../..'
import type { IsEmptyObject, Simplify } from 'type-fest-4'

export * from './static'

// User arguments per module name and version
export type GetUserModuleArg<
  N extends ModuleName = ModuleName,
  CD = FormatParameter<GetDeploymentInputs<N>['configData'][number]>,
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
        [K in NonNullable<T>[number]]: GetUserModuleArg<K>
      }

export type GetUserOptionalArgs<
  T extends RequestedModules['optionalModules'],
  R = GetUserOptionalArgsBase<T>,
> = EmptyObjectToNever<
  OmitNever<{
    [K in keyof R]: IsEmptyObject<R[K]> extends true ? never : R[K]
  }>
>

export type GetUserArgs<
  T extends RequestedModules = RequestedModules,
  FT extends FactoryType = 'default',
> = Simplify<
  OmitNever<{
    orchestrator?: OrchestratorArgs
    fundingManager: GetUserModuleArg<T['fundingManager']>
    authorizer: GetUserModuleArg<T['authorizer']>
    paymentProcessor: GetUserModuleArg<T['paymentProcessor']>
    optionalModules: GetUserOptionalArgs<T['optionalModules']>
    issuanceToken: FT extends 'restricted-pim' ? IssuanceTokenArgs : never
  }>
>
