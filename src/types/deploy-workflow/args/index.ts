// external dependencies
import type { IsEmptyObject, Simplify, UnionToTuple } from 'type-fest-4'
import type { ModuleName } from '@inverter-network/abis'

// sdk types
import type { OrchestratorArgs } from './static'

import type {
  OmitNever,
  GetModuleConfigData,
  EmptyObjectToNever,
  RequestedModules,
  ExtendedParameterToPrimitiveType,
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
 * @description Get the user arguments for a given requested modules and factory type
 * @param T - The requested modules
 * @returns The user arguments
 */
export type GetDeployWorkflowArgs<
  T extends MixedRequestedModules = RequestedModules,
> = Simplify<
  OmitNever<{
    orchestrator?: OrchestratorArgs
    fundingManager: GetDeployWorkflowModuleArg<T['fundingManager']>
    authorizer: GetDeployWorkflowModuleArg<T['authorizer']>
    paymentProcessor: GetDeployWorkflowModuleArg<T['paymentProcessor']>
    optionalModules: GetDeployWorkflowOptionalArgs<T['optionalModules']>
  }>
>
