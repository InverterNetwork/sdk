// external dependencies
import type { IsEmptyObject, Simplify } from 'type-fest-4'
import type { ModuleName } from '@inverter-network/abis'

// sdk types
import type {
  BeneficiaryArgs,
  InitialPurchaseAmountArgs,
  IssuanceTokenArgs,
  MigrationConfigArgs,
  OrchestratorArgs,
} from './static'

import type {
  OmitNever,
  GetModuleConfigData,
  EmptyObjectToNever,
  RequestedModules,
  FactoryType,
  ExtendedParameterToPrimitiveType,
  FilterByPrefix,
} from '@/types'

export * from './static'

/**
 * @description Get the user module argument for a given module name and config data
 * @param N - The module name
 * @param CD - The config data = `GetModuleConfigData<N>[number]`
 * @returns The user module argument
 */
export type GetUserModuleArg<
  N extends ModuleName = ModuleName,
  CD = GetModuleConfigData<N>[number],
> = EmptyObjectToNever<{
  // @ts-expect-error - TS cant resolve name
  [PN in CD['name']]: ExtendedParameterToPrimitiveType<
    Extract<CD, { name: PN }>
  >
}>

/**
 * @description Get the user optional module arguments for a given optional modules
 * @param T - The optional modules
 * @returns The user optional module arguments
 */
export type GetUserOptionalArgsBase<
  T extends RequestedModules['optionalModules'],
> = T extends undefined
  ? never
  : {
      [K in NonNullable<T>[number]]: GetUserModuleArg<K>
    }

/**
 * @description Get the user optional module arguments for a given optional modules
 * @param T - The optional modules
 * @returns The user optional module arguments
 */
export type GetUserOptionalArgs<
  T extends RequestedModules['optionalModules'],
  R = GetUserOptionalArgsBase<T>,
> = EmptyObjectToNever<
  OmitNever<{
    [K in keyof R]: IsEmptyObject<R[K]> extends true ? never : R[K]
  }>
>

/**
 * @description Get the user funding manager argument for a given module name and factory type
 * @param T - The module name
 * @param FT - The factory type
 * @returns The user funding manager argument
 */
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

/**
 * @description Get the user arguments for a given requested modules and factory type
 * @param T - The requested modules
 * @param FT - The factory type
 * @returns The user arguments
 */
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
