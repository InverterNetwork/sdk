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
import type { Inverter } from '@'
import type { AbiStateMutability } from 'abitype'

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