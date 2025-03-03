// external dependencies
import type {
  ExtendedAbi,
  ExtendedAbiFunction,
  ExtendedAbiParameter,
} from '@inverter-network/abis'

import type {
  AbiStateMutability,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import type { TupleToUnion, Simplify } from 'type-fest-4'

// sdk types
import type {
  TagConfig,
  MethodKind,
  PopContractReturnType,
  PopPublicClient,
  PopWalletClient,
  EstimateGasOutput,
  GetMethodParams,
  GetMethodReturnType,
  MethodOptions,
  WriteOutput,
} from '@/types'

import type { Inverter } from '@/inverter'

// GET RUN
// ----------------------------------------------------------------------------

/**
 * The Parameters for the getRun function
 * @template ExtendedInputs - The extended inputs
 * @template ExtendedOutputs - The extended outputs
 * @template Kind - The kind of method
 */
export type GetModuleGetRunParams<
  ExtendedInputs extends readonly ExtendedAbiParameter[],
  ExtendedOutputs extends readonly ExtendedAbiParameter[],
  Kind extends MethodKind,
> = {
  publicClient: PopPublicClient
  name: string
  contract: PopContractReturnType
  extendedInputs: ExtendedInputs
  extendedOutputs: ExtendedOutputs
  walletClient?: PopWalletClient
  tagConfig?: TagConfig
  kind: Kind
  self?: Inverter
}

/**
 * The return type for the getRun function
 * @template ExtendedInputs - The extended inputs
 * @template ExtendedOutputs - The extended outputs
 * @template Kind - The kind of method
 */
export type GetModuleGetRunReturnType<
  ExtendedInputs extends readonly ExtendedAbiParameter[],
  ExtendedOutputs extends readonly ExtendedAbiParameter[],
  Kind extends MethodKind,
> = (
  args: GetMethodParams<ExtendedInputs>,
  options?: MethodOptions
) => Promise<GetMethodReturnType<ExtendedOutputs, Kind>>

// GET ITERATE METHODS
// ----------------------------------------------------------------------------

/**
 * The Parameters for the iterateMethods function
 * @template A - The extended abi
 * @template T - The state mutability array
 * @template Kind - The kind of method
 */
export type GetModuleItterateMethodsParams<
  A extends ExtendedAbi,
  T extends AbiStateMutability[],
  Kind extends MethodKind,
> = {
  abi: A
  type: T
  contract: PopContractReturnType
  kind: Kind
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
  tagConfig?: TagConfig
  self?: Inverter<any>
}

/**
 * The return type for the iterateMethods function
 * @template A - The extended abi
 * @template T - The state mutability array
 * @template Kind - The kind of method
 */
export type GetModuleIterateMethodsReturnType<
  A extends ExtendedAbi,
  T extends AbiStateMutability[],
  Kind extends MethodKind,
> = Simplify<{
  [N in ExtractAbiFunctionNames<
    A,
    TupleToUnion<T>
  >]: GetModuleConstructMethodReturnType<ExtractAbiFunction<A, N>, Kind>
}>

// CONSTRUCT METHOD
// ----------------------------------------------------------------------------

/**
 * The Parameters for the constructMethod function
 * @template TAbiFunction - The extended abi function
 * @template Kind - The kind of method
 */
export type GetModuleConstructMethodParams<
  TAbiFunction extends ExtendedAbiFunction,
  Kind extends MethodKind,
> = {
  walletClient?: PopWalletClient
  publicClient: PopPublicClient
  abiFunction: TAbiFunction
  contract: PopContractReturnType
  tagConfig?: TagConfig
  kind: Kind
  self?: Inverter
}

/**
 * The return type for the constructMethod function
 * @template TAbiFunction - The extended abi function
 * @template Kind - The kind of method
 */
export type GetModuleConstructMethodReturnType<
  TAbiFunction extends ExtendedAbiFunction,
  Kind extends MethodKind,
> = {
  name: TAbiFunction['name']
  description: TAbiFunction['description']
  inputs: TAbiFunction['inputs']
  outputs: Kind extends 'read' | 'simulate'
    ? TAbiFunction['outputs']
    : Kind extends 'write'
      ? WriteOutput
      : EstimateGasOutput

  run: GetModuleGetRunReturnType<
    TAbiFunction['inputs'],
    TAbiFunction['outputs'],
    Kind
  >
}
