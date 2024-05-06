import { GetModuleVersion, ModuleName, data } from '@inverter-network/abis'
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
    optionalModules?: OptionalModuleParams // Mark this field as optional
  }>
>

type Module = (typeof data)[number]

type ModuleNamesByType = {
  [K in Module as K['moduleType']]: K['name']
}

type OptionalModulesParamNames = {
  [K in ModuleNamesByType['logicModule'] | ModuleNamesByType['utils']]?: string
}

type DeployParamNamesByModuleName<
  ModuleName extends Module['name'],
  ArgType extends keyof Module['deploymentArgs'],
> = Extract<
  Module,
  { name: ModuleName }
>['deploymentArgs'][ArgType][number]['name']

type DeployParamNames<ModuleName extends Module['name']> =
  | DeployParamNamesByModuleName<ModuleName, 'configData'>
  | DeployParamNamesByModuleName<ModuleName, 'dependencyData'>

export type OptionalModuleParams = {
  [ModuleName in keyof OptionalModulesParamNames]?: {
    [ParamName in DeployParamNames<ModuleName & string>]: string
  }
}
