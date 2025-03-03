// external dependencies
import type { ModuleName } from '@inverter-network/abis'
import type { Simplify } from 'type-fest-4'

// sdk types
import type {
  EmptyObjectToNever,
  OmitNever,
  RequestedModules,
  FactoryType,
  GetModuleConfigData,
} from '@/types'

/**
 * @description The module schema for a module
 * @template N - The module name
 * @template ON - The optional module name
 * @returns The module schema
 */
export type GetGetDeployModuleSchema<
  N extends ModuleName = ModuleName,
  ON extends string | undefined = undefined,
> = {
  name: ON extends string ? ON : N
  inputs: ON extends string
    ? [
        Extract<
          GetModuleConfigData<N>[number],
          {
            name: ON
          }
        >,
      ]
    : GetModuleConfigData<N>
}

/**
 * @description The optional modules schema for deployment
 * @template T - The optional modules
 * @returns The optional modules schema
 */
export type OptionalModules<T extends RequestedModules['optionalModules']> =
  Simplify<
    T extends undefined
      ? never
      : {
          [K in keyof T]: GetGetDeployModuleSchema<
            // @ts-expect-error - TS cant resolve name
            T[K]
          >
        }
  >

/**
 * @description The deployment schema for a factory type
 * @template T - The requested modules
 * @template FT - The factory type
 * @returns The deployment schema
 */
export type GetGetDeploySchema<
  T extends RequestedModules = RequestedModules,
  FT extends FactoryType = 'default',
> = Simplify<
  OmitNever<{
    orchestrator: GetGetDeployModuleSchema<'OrchestratorFactory_v1'>
    paymentProcessor: GetGetDeployModuleSchema<T['paymentProcessor']>
    fundingManager: GetGetDeployModuleSchema<T['fundingManager']>
    authorizer: GetGetDeployModuleSchema<T['authorizer']>
    optionalModules: EmptyObjectToNever<OptionalModules<T['optionalModules']>>
    // OTHER FACTORY TYPE INPUTS
    issuanceToken: FT extends
      | 'restricted-pim'
      | 'immutable-pim'
      | 'migrating-pim'
      ? GetGetDeployModuleSchema<
          `${FT extends 'restricted-pim' ? 'Restricted' : 'Immutable'}_PIM_Factory_v1`,
          'issuanceToken'
        >
      : never
    initialPurchaseAmount: FT extends 'immutable-pim' | 'migrating-pim'
      ? GetGetDeployModuleSchema<
          'Immutable_PIM_Factory_v1',
          'initialPurchaseAmount'
        >
      : never
    beneficiary: FT extends 'restricted-pim'
      ? GetGetDeployModuleSchema<'Restricted_PIM_Factory_v1', 'beneficiary'>
      : never
    migrationConfig: FT extends 'migrating-pim'
      ? GetGetDeployModuleSchema<'Migrating_PIM_Factory_v1', 'migrationConfig'>
      : never
  }>
>
