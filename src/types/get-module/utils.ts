import type {
  ExtendedAbi,
  ExtendedAbiFunction,
  ExtendedAbiParameter,
} from '@inverter-network/abis'
import type {
  Extras,
  MethodKind,
  PopContractReturnType,
  PopPublicClient,
  PopWalletClient,
} from '@/types'
import type {
  EstimateGasOutput,
  GetMethodArgs,
  GetMethodResponse,
  Inverter,
  MethodOptions,
  WriteOutput,
} from '@'
import type {
  AbiStateMutability,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import type { TupleToUnion, Simplify } from 'type-fest-4'

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
  extras?: Extras
  kind: Kind
  self?: Inverter
}

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
  extras?: Extras
  self?: Inverter<any>
}

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
  extras?: Extras
  kind: Kind
  self?: Inverter
}

export type GetModuleGetRunReturnType<
  ExtendedInputs extends readonly ExtendedAbiParameter[],
  ExtendedOutputs extends readonly ExtendedAbiParameter[],
  Kind extends MethodKind,
> = (
  args: GetMethodArgs<ExtendedInputs>,
  options?: MethodOptions
) => Promise<GetMethodResponse<ExtendedOutputs, Kind>>

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
