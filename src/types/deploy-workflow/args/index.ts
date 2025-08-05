// external dependencies
import type { ModuleName } from '@inverter-network/abis'
import type {
  EmptyObjectToNever,
  ExtendedParameterToPrimitiveType,
  GetModuleConfigData,
  MixedRequestedModules,
  ModuleData,
  OmitNever,
  RequestedModules,
} from '@/types'
import type { IsEmptyObject, Simplify } from 'type-fest-4'

// sdk types
import type { OrchestratorArgs } from './static'

export * from './static'

/**
 * @description Get the user module argument for a given module name and config data
 * @param TModuleName - The module name
 * @param TConfigData - The config data = `GetModuleConfigData<TModuleName>[number]`
 * @returns The user module argument
 */
export type GetDeployWorkflowModuleArg<
  TModuleName extends ModuleName | ModuleData = ModuleName,
  TUseTags extends boolean = true,
  TConfigData = TModuleName extends ModuleData
    ? TModuleName['deploymentInputs'] extends NonNullable<
        ModuleData['deploymentInputs']
      >
      ? TModuleName['deploymentInputs']['configData'][number]
      : never
    : TModuleName extends ModuleName
      ? GetModuleConfigData<TModuleName>[number]
      : never,
> = EmptyObjectToNever<{
  // @ts-expect-error - TS cant resolve name
  [PN in TConfigData['name']]: ExtendedParameterToPrimitiveType<
    Extract<TConfigData, { name: PN }>,
    TUseTags
  >
}>

/**
 * @description Helper type to get module name from either ModuleName or ModuleData
 */
type GetModuleName<T> = T extends ModuleData
  ? T['name']
  : T extends ModuleName
    ? T
    : never

/**
 * @description Helper type to get module args from either ModuleName or ModuleData
 */
type GetModuleArgs<T, TUseTags extends boolean = true> = T extends
  | ModuleData
  | ModuleName
  ? GetDeployWorkflowModuleArg<T, TUseTags>
  : never

/**
 * @description Get the user optional module arguments for a given optional modules
 * @param T - The optional modules
 * @returns The user optional module arguments
 */
export type GetDeployWorkflowOptionalArgsBase<
  TRequestedModules extends MixedRequestedModules['optionalModules'],
  TUseTags extends boolean = true,
> = TRequestedModules extends undefined
  ? never
  : NonNullable<TRequestedModules>[number] extends infer N
    ? {
        [K in GetModuleName<N>]: GetModuleArgs<N, TUseTags>
      }
    : never

/**
 * @description Get the user optional module arguments for a given optional modules
 * @param T - The optional modules
 * @returns The user optional module arguments
 */
export type GetDeployWorkflowOptionalArgs<
  TRequestedModules extends MixedRequestedModules['optionalModules'],
  TUseTags extends boolean = true,
  R = GetDeployWorkflowOptionalArgsBase<TRequestedModules, TUseTags>,
> = EmptyObjectToNever<
  OmitNever<{
    [K in keyof R]: IsEmptyObject<R[K]> extends true ? never : R[K]
  }>
>

/**
 * @description Get the user arguments for a given requested modules and factory type
 * @param TRequestedModules - The requested modules
 * @param TUseTags - Whether to use tags
 * @returns The user arguments
 */
export type GetDeployWorkflowArgs<
  TRequestedModules extends MixedRequestedModules = RequestedModules,
  TUseTags extends boolean = true,
> = Simplify<
  OmitNever<{
    orchestrator?: OrchestratorArgs
    fundingManager: GetDeployWorkflowModuleArg<
      TRequestedModules['fundingManager'],
      TUseTags
    >
    authorizer: GetDeployWorkflowModuleArg<
      TRequestedModules['authorizer'],
      TUseTags
    >
    paymentProcessor: GetDeployWorkflowModuleArg<
      TRequestedModules['paymentProcessor'],
      TUseTags
    >
    optionalModules: GetDeployWorkflowOptionalArgs<
      TRequestedModules['optionalModules'],
      TUseTags
    >
  }>
>
