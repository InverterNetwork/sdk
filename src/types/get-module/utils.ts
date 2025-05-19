// external dependencies
import type {
  ExtendedAbi,
  ExtendedAbiFunction,
  ExtendedAbiParameter,
} from '@inverter-network/abis'
import type { Inverter } from '@/inverter'
// sdk types
import type {
  EstimateGasOutput,
  GetMethodParams,
  GetMethodReturnType,
  MethodKind,
  MethodOptions,
  PopContractReturnType,
  PopPublicClient,
  PopWalletClient,
  TagConfig,
  WriteOutput,
} from '@/types'
import type {
  AbiStateMutability,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import type { Simplify, TupleToUnion } from 'type-fest-4'

// GET RUN
// ----------------------------------------------------------------------------

/**
 * The Parameters for the getRun function
 * @template TInputs - The extended inputs
 * @template TOutputs - The extended outputs
 * @template TMethodKind - The kind of method
 */
export type GetModuleGetRunParams<
  TInputs extends readonly ExtendedAbiParameter[],
  TOutputs extends readonly ExtendedAbiParameter[],
  TMethodKind extends MethodKind,
> = {
  publicClient: PopPublicClient
  name: string
  contract: PopContractReturnType
  extendedInputs: TInputs
  extendedOutputs: TOutputs
  walletClient?: PopWalletClient
  tagConfig?: TagConfig
  kind: TMethodKind
  self?: Inverter
}

/**
 * The return type for the getRun function
 * @template TInputs - The extended inputs
 * @template TOutputs - The extended outputs
 * @template TMethodKind - The kind of method
 */
export type GetModuleGetRunReturnType<
  TInputs extends readonly ExtendedAbiParameter[],
  TOutputs extends readonly ExtendedAbiParameter[],
  TMethodKind extends MethodKind,
> = (
  args: GetMethodParams<TInputs>,
  options?: MethodOptions
) => Promise<GetMethodReturnType<TOutputs, TMethodKind>>

// GET ITERATE METHODS
// ----------------------------------------------------------------------------

/**
 * The Parameters for the iterateMethods function
 * @template TAbi - The extended abi
 * @template TAbiStateMutability - The state mutability array
 * @template TMethodKind - The kind of method
 */
export type GetModuleItterateMethodsParams<
  TAbi extends ExtendedAbi,
  TAbiStateMutability extends AbiStateMutability[],
  TMethodKind extends MethodKind,
> = {
  abi: TAbi
  type: TAbiStateMutability
  contract: PopContractReturnType
  kind: TMethodKind
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
  tagConfig?: TagConfig
  self?: Inverter<any>
}

/**
 * The return type for the iterateMethods function
 * @template TAbi - The extended abi
 * @template TAbiStateMutability - The state mutability array
 * @template TMethodKind - The kind of method
 */
export type GetModuleIterateMethodsReturnType<
  TAbi extends ExtendedAbi,
  TAbiStateMutability extends AbiStateMutability[],
  TMethodKind extends MethodKind,
> = Simplify<{
  [N in ExtractAbiFunctionNames<
    TAbi,
    TupleToUnion<TAbiStateMutability>
  >]: GetModuleConstructMethodReturnType<
    ExtractAbiFunction<TAbi, N>,
    TMethodKind extends 'bytecode' ? 'write' : TMethodKind
  >
}>

// CONSTRUCT METHOD
// ----------------------------------------------------------------------------

/**
 * The Parameters for the constructMethod function
 * @template TAbiFunction - The extended abi function
 * @template TMethodKind - The kind of method
 */
export type GetModuleConstructMethodParams<
  TAbiFunction extends ExtendedAbiFunction,
  TMethodKind extends MethodKind,
> = {
  walletClient?: PopWalletClient
  publicClient: PopPublicClient
  abiFunction: TAbiFunction
  contract: PopContractReturnType
  tagConfig?: TagConfig
  kind: TMethodKind
  self?: Inverter
}

/**
 * The return type for the constructMethod function
 * @template TAbiFunction - The extended abi function
 * @template TMethodKind - The kind of method
 */
export type GetModuleConstructMethodReturnType<
  TAbiFunction extends ExtendedAbiFunction,
  TMethodKind extends MethodKind,
> = {
  name: TAbiFunction['name']
  description: TAbiFunction['description']
  inputs: TAbiFunction['inputs']
  outputs: TMethodKind extends 'read' | 'simulate'
    ? TAbiFunction['outputs']
    : TMethodKind extends 'write'
      ? WriteOutput
      : EstimateGasOutput

  run: GetModuleGetRunReturnType<
    TAbiFunction['inputs'],
    TAbiFunction['outputs'],
    TMethodKind
  >
}
