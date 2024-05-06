import { GetModuleVersion, ModuleName, Pretty } from '@inverter-network/abis'
import { OrchestratorArgs } from './static'
import { RequestedModules } from '../requested'
import { ExcludeNeverFields, GetDeploymentArgs } from '../../../types'
import { FormattedParameterToPrimitiveType } from '../../../types/utils/parameter/primitive'
export * from './static'

// User arguments per module name and version
export type UserModuleArg<
  N extends ModuleName,
  V extends GetModuleVersion<N>,
  CD = GetDeploymentArgs<N, V>['configData'][number],
> = {
  // @ts-expect-error - TS doesn't resolve name and type
  [PN in CD['name']]: FormattedParameterToPrimitiveType<
    Extract<CD, { name: PN }>
  >
}

export type UserOptionalArgs<T extends RequestedModules['optionalModules']> =
  T extends infer U
    ? U extends RequestedModules['optionalModules']
      ? {
          [K in keyof U]: UserModuleArg<
            // @ts-expect-error - TS doesn't resolve name
            U[K]['name'],
            // @ts-expect-error - TS doesn't resolve version
            U[K]['version']
          >
        }
      : never
    : never

export type UserArgs<T extends RequestedModules = RequestedModules> = Pretty<
  ExcludeNeverFields<{
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
