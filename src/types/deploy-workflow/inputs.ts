// external dependencies
import type { ModuleName } from '@inverter-network/abis'
import type { Simplify, UnionToTuple } from 'type-fest-4'

// sdk types
import type {
  EmptyObjectToNever,
  OmitNever,
  RequestedModules,
  GetModuleConfigData,
  MixedRequestedModules,
  ModuleData,
} from '@/types'

/**
 * @description Retrieve the inputs for a module
 * @template N - The module name
 * @template ON - The optional module name
 * @returns The module inputs
 */
export type GetDeployWorkflowModuleInputs<
  N extends ModuleName | ModuleData = ModuleName,
  ON extends string | undefined = undefined,
  T = N extends ModuleData
    ? N['deploymentInputs'] extends NonNullable<N['deploymentInputs']>
      ? N['deploymentInputs']['configData']
      : never
    : N extends ModuleName
      ? GetModuleConfigData<N>
      : never,
> = {
  name: ON extends string ? ON : N extends ModuleData ? N['name'] : N
  inputs: T
}

/**
 * @description The optional modules schema for deployment
 * @template T - The optional modules
 * @returns The optional modules schema
 */
export type OptionalModules<
  T extends MixedRequestedModules['optionalModules'],
> = Simplify<
  T extends undefined | []
    ? never
    : UnionToTuple<
          GetDeployWorkflowModuleInputs<NonNullable<T>[number]>
        > extends infer R extends { name: string }[]
      ? R extends { name: string }[]
        ? R
        : never
      : never
>

/**
 * @description The deployment schema for a factory type
 * @template T - The requested modules
 * @template FT - The factory type
 * @returns The deployment schema
 */
export type GetDeployWorkflowInputs<
  T extends MixedRequestedModules = RequestedModules,
> = Simplify<
  OmitNever<{
    orchestrator: GetDeployWorkflowModuleInputs<'OrchestratorFactory_v1'>
    paymentProcessor: GetDeployWorkflowModuleInputs<T['paymentProcessor']>
    fundingManager: GetDeployWorkflowModuleInputs<T['fundingManager']>
    authorizer: GetDeployWorkflowModuleInputs<T['authorizer']>
    optionalModules: EmptyObjectToNever<OptionalModules<T['optionalModules']>>
  }>
>
