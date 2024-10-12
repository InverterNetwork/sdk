import type { ModuleName } from '@inverter-network/abis'
import type { Simplify } from 'type-fest-4'
import type {
  EmptyObjectToNever,
  OmitNever,
  RequestedModules,
  FactoryType,
  GetDeploymentParameters,
} from '@/types'

export type ModuleSchema<
  N extends ModuleName = ModuleName,
  ON extends string | undefined = undefined,
> = {
  name: ON extends string ? ON : N
  inputs: ON extends string
    ? Extract<
        GetDeploymentParameters<N>[number],
        {
          name: ON
        }
      >
    : GetDeploymentParameters<N>
}

export type OptionalModules<T extends RequestedModules['optionalModules']> =
  Simplify<
    T extends undefined
      ? never
      : {
          [K in keyof T]: ModuleSchema<
            // @ts-expect-error - TS cant resolve name
            T[K]
          >
        }
  >

export type DeploySchema<
  T extends RequestedModules = RequestedModules,
  FT extends FactoryType = 'default',
> = Simplify<
  OmitNever<{
    orchestrator: ModuleSchema<'OrchestratorFactory_v1'>
    paymentProcessor: ModuleSchema<T['paymentProcessor']>
    fundingManager: ModuleSchema<T['fundingManager']>
    authorizer: ModuleSchema<T['authorizer']>
    optionalModules: EmptyObjectToNever<OptionalModules<T['optionalModules']>>
    // OTHER FACTORY TYPE INPUTS
    issuanceToken: FT extends 'restricted-pim' | 'immutable-pim'
      ? ModuleSchema<
          `${FT extends 'restricted-pim' ? 'Restricted' : 'Immutable'}_PIM_Factory_v1`,
          'issuanceToken'
        >
      : never
    initialPurchaseAmount: FT extends 'immutable-pim'
      ? ModuleSchema<'Immutable_PIM_Factory_v1', 'initialPurchaseAmount'>
      : never
    beneficiary: FT extends 'restricted-pim'
      ? ModuleSchema<'Restricted_PIM_Factory_v1', 'beneficiary'>
      : never
  }>
>
