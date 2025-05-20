// external dependencies
import type { ModuleName } from '@inverter-network/abis'
// sdk types
import type {
  EmptyObjectToNever,
  GetModuleConfigData,
  MixedRequestedModules,
  ModuleData,
  OmitNever,
  RequestedModules,
} from '@/types'
import type { Simplify, UnionToTuple } from 'type-fest-4'

/**
 * @description Retrieve the inputs for a module
 * @template TModuleName - The module name
 * @template TOptionalModuleName - The optional module name
 * @returns The module inputs
 */
export type GetDeployWorkflowModuleInputs<
  TModuleName extends ModuleName | ModuleData = ModuleName,
  TOptionalModuleName extends string | undefined = undefined,
  T = TModuleName extends ModuleData
    ? TModuleName['deploymentInputs'] extends NonNullable<
        TModuleName['deploymentInputs']
      >
      ? TModuleName['deploymentInputs']['configData']
      : never
    : TModuleName extends ModuleName
      ? GetModuleConfigData<TModuleName>
      : never,
> = {
  name: TOptionalModuleName extends string
    ? TOptionalModuleName
    : TModuleName extends ModuleData
      ? TModuleName['name']
      : TModuleName
  inputs: T
}

/**
 * @description The optional modules schema for deployment
 * @template T - The optional modules
 * @returns The optional modules schema
 */
export type OptionalModules<
  TRequestedModules extends MixedRequestedModules['optionalModules'],
> = Simplify<
  TRequestedModules extends undefined | []
    ? never
    : UnionToTuple<
          GetDeployWorkflowModuleInputs<NonNullable<TRequestedModules>[number]>
        > extends infer R extends { name: string }[]
      ? R extends { name: string }[]
        ? R
        : never
      : never
>

/**
 * @description The deployment schema for a factory type
 * @template TRequestedModules - The requested modules
 * @returns The deployment schema
 */
export type GetDeployWorkflowInputs<
  TRequestedModules extends MixedRequestedModules = RequestedModules,
> = Simplify<
  OmitNever<{
    orchestrator: GetDeployWorkflowModuleInputs<'OrchestratorFactory_v1'>
    paymentProcessor: GetDeployWorkflowModuleInputs<
      TRequestedModules['paymentProcessor']
    >
    fundingManager: GetDeployWorkflowModuleInputs<
      TRequestedModules['fundingManager']
    >
    authorizer: GetDeployWorkflowModuleInputs<TRequestedModules['authorizer']>
    optionalModules: EmptyObjectToNever<
      OptionalModules<TRequestedModules['optionalModules']>
    >
  }>
>
