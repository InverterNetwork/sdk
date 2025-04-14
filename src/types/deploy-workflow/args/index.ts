// external dependencies
import type { IsEmptyObject, Simplify, UnionToTuple } from 'type-fest-4'
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
  MixedRequestedModules,
  ModuleData,
} from '@/types'

export * from './static'

/**
 * @description Get the user module argument for a given module name and config data
 * @param N - The module name
 * @param CD - The config data = `GetModuleConfigData<N>[number]`
 * @returns The user module argument
 */
export type GetDeployWorkflowModuleArg<
  N extends ModuleName | ModuleData = ModuleName,
  CD = N extends ModuleData
    ? N['deploymentInputs'] extends NonNullable<ModuleData['deploymentInputs']>
      ? N['deploymentInputs']['configData'][number]
      : never
    : N extends ModuleName
      ? GetModuleConfigData<N>[number]
      : never,
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
export type GetDeployWorkflowOptionalArgsBase<
  T extends MixedRequestedModules['optionalModules'],
> = T extends undefined
  ? never
  : UnionToTuple<
        GetDeployWorkflowModuleArg<NonNullable<T>[number]>
      > extends infer R
    ? // if R is an empty array, return never
      R extends []
      ? never
      : R
    : never

/**
 * @description Get the user optional module arguments for a given optional modules
 * @param T - The optional modules
 * @returns The user optional module arguments
 */
export type GetDeployWorkflowOptionalArgs<
  T extends MixedRequestedModules['optionalModules'],
  R = GetDeployWorkflowOptionalArgsBase<T>,
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
export type GetDeployWorkflowFundingManagerArg<
  T extends ModuleName | ModuleData,
  FT extends FactoryType = 'default',
> = Simplify<
  FilterByPrefix<T, 'FM_BC'> extends never
    ? GetDeployWorkflowModuleArg<T>
    : FT extends 'default'
      ? GetDeployWorkflowModuleArg<T>
      : Omit<GetDeployWorkflowModuleArg<T>, 'issuanceToken'>
>

/**
 * @description Get the user arguments for a given requested modules and factory type
 * @param T - The requested modules
 * @param FT - The factory type
 * @returns The user arguments
 */
export type GetDeployWorkflowArgs<
  T extends MixedRequestedModules = RequestedModules,
  FT extends FactoryType = 'default',
> = Simplify<
  OmitNever<{
    orchestrator?: OrchestratorArgs
    fundingManager: GetDeployWorkflowFundingManagerArg<T['fundingManager'], FT>
    authorizer: GetDeployWorkflowModuleArg<T['authorizer']>
    paymentProcessor: GetDeployWorkflowModuleArg<T['paymentProcessor']>
    optionalModules: GetDeployWorkflowOptionalArgs<T['optionalModules']>
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
