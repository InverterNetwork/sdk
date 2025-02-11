import type { ModuleName } from '@inverter-network/abis'
import type {
  BeneficiaryArgs,
  InitialPurchaseAmountArgs,
  IssuanceTokenArgs,
  MigrationConfigArgs,
  OrchestratorArgs,
} from './static'
import type {
  OmitNever,
  GetDeploymentInputs,
  EmptyObjectToNever,
  RequestedModules,
  FactoryType,
  ExtendedParameterToPrimitiveType,
  FilterByPrefix,
} from '@/types'
import type { IsEmptyObject, Simplify } from 'type-fest-4'

export * from './static'

// User arguments per module name and version
export type GetUserModuleArg<
  N extends ModuleName = ModuleName,
  CD = GetDeploymentInputs<N>['configData'][number],
> = EmptyObjectToNever<{
  // @ts-expect-error - TS cant resolve name
  [PN in CD['name']]: ExtendedParameterToPrimitiveType<
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

export type GetFundingManagerArg<
  T extends ModuleName,
  FT extends FactoryType = 'default',
> = Simplify<
  FilterByPrefix<T, 'FM_BC'> extends never
    ? GetUserModuleArg<T>
    : FT extends 'default'
      ? GetUserModuleArg<T>
      : Omit<GetUserModuleArg<T>, 'issuanceToken'>
>

export type GetUserArgs<
  T extends RequestedModules = RequestedModules,
  FT extends FactoryType = 'default',
> = Simplify<
  OmitNever<{
    orchestrator?: OrchestratorArgs
    fundingManager: GetFundingManagerArg<T['fundingManager'], FT>
    authorizer: GetUserModuleArg<T['authorizer']>
    paymentProcessor: GetUserModuleArg<T['paymentProcessor']>
    optionalModules: GetUserOptionalArgs<T['optionalModules']>
    issuanceToken: FT extends
      | 'restricted-pim'
      | 'immutable-pim'
      | 'migrating-pim'
      ? IssuanceTokenArgs
      : never
    initialPurchaseAmount: FT extends 'immutable-pim' | 'migrating-pim'
      ? InitialPurchaseAmountArgs
      : never
    beneficiary: FT extends 'restricted-pim' ? BeneficiaryArgs : never
    migrationConfig: FT extends 'migrating-pim' ? MigrationConfigArgs : never
  }>
>
