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
  FormatGetTagCallbackParams,
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
  TUseTags extends boolean = true,
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
  useTags?: TUseTags
}

/**
 * The return type for the getRun function
 * @template TInputs - The extended inputs
 * @template TOutputs - The extended outputs
 * @template TMethodKind - The kind of method
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 */
export type GetModuleGetRunReturnType<
  TInputs extends readonly ExtendedAbiParameter[],
  TOutputs extends readonly ExtendedAbiParameter[],
  TMethodKind extends MethodKind,
  TUseTags extends boolean = true,
> = (
  args: GetMethodParams<TInputs, TUseTags>,
  options?: MethodOptions
) => Promise<GetMethodReturnType<TOutputs, TMethodKind, TUseTags>>

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
  TUseTags extends boolean = true,
> = {
  abi: TAbi
  type: TAbiStateMutability
  contract: PopContractReturnType
  kind: TMethodKind
  publicClient: PopPublicClient
  walletClient?: PopWalletClient
  tagConfig?: TagConfig
  self?: Inverter<any>
  useTags?: TUseTags
}

/**
 * The return type for the iterateMethods function
 * @template TAbi - The extended abi
 * @template TAbiStateMutability - The state mutability array
 * @template TMethodKind - The kind of method
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 */
export type GetModuleIterateMethodsReturnType<
  TAbi extends ExtendedAbi,
  TAbiStateMutability extends AbiStateMutability[],
  TMethodKind extends MethodKind,
  TUseTags extends boolean = true,
> = Simplify<{
  [N in ExtractAbiFunctionNames<
    TAbi,
    TupleToUnion<TAbiStateMutability>
  >]: GetModuleConstructMethodReturnType<
    ExtractAbiFunction<TAbi, N>,
    TMethodKind,
    TUseTags
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
  TUseTags extends boolean = true,
> = {
  walletClient?: PopWalletClient
  publicClient: PopPublicClient
  abiFunction: TAbiFunction
  contract: PopContractReturnType
  tagConfig?: TagConfig
  kind: TMethodKind
  self?: Inverter
  useTags?: TUseTags
}

/**
 * The return type for the constructMethod function
 * @template TAbiFunction - The extended abi function
 * @template TMethodKind - The kind of method
 * @template TUseTags - Whether auto parse inputs, outputs and approve allowances using tag configs
 */
export type GetModuleConstructMethodReturnType<
  TAbiFunction extends ExtendedAbiFunction,
  TMethodKind extends MethodKind,
  TUseTags extends boolean = true,
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
    TMethodKind,
    TUseTags
  >
  // If the method kind is bytecode, add the formatOutputs function
  decodeResult: TMethodKind extends 'bytecode'
    ? (
        res: any
      ) => FormatBytecodeOutputsReturnType<TAbiFunction['outputs'], TUseTags>
    : never
}

// FORMAT BYTECODE OUTPUTS
// ----------------------------------------------------------------------------

export type FormatBytecodeOutputsParams<TUseTags extends boolean = true> =
  FormatGetTagCallbackParams & {
    res: `0x${string}`
    functionName: string
    useTags?: TUseTags
  }

export type FormatBytecodeOutputsReturnType<
  TExtendedOutputs extends readonly ExtendedAbiParameter[],
  TUseTags extends boolean = true,
> = Promise<GetMethodReturnType<TExtendedOutputs, 'read', TUseTags>>
