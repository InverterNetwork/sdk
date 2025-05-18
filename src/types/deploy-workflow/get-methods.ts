// external dependencies
import type { PublicClient, SimulateContractReturnType } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'

import type {
  ConstructedArgsArray,
  GetDeployWorkflowArgs,
  MethodOptions,
  MixedRequestedModules,
  PopWalletClient,
} from '@/types'

/**
 * @description deployWorkflow functions write return type
 */
export type DeployWorkflowWriteReturnType = {
  transactionHash: `0x${string}`
  orchestratorAddress: `0x${string}`
}

/**
 * @description deployWorkflow functions simulate return type
 */
export type DeployWorkflowSimulateReturnType = {
  result: `0x${string}`
  request: SimulateContractReturnType
}

/**
 * @description deployWorkflow functions estimate gas return type
 */
export type DeployWorkflowEstimateGasReturnType = {
  value: string
  formatted: string
}

/**
 * @description deployWorkflow functions bytecode return type
 */
export type DeployWorkflowBytecodeReturnType = {
  rawArgs: ConstructedArgsArray
  bytecode: `0x${string}`
  factoryAddress: `0x${string}`
  orchestratorAddress: `0x${string}`
}

/**
 * @template T - The requested modules
 * @description Parameters for the getMothods util of deployWorkflow function
 */
export type GetMethodsParams<T extends MixedRequestedModules> = {
  requestedModules: T
  publicClient: PublicClient
  walletClient: PopWalletClient
  self?: Inverter
}

/**
 * @template T - The requested modules
 * @description Return type for the getMothods util of deployWorkflow function
 */
export type GetMethodsReturnType<
  T extends MixedRequestedModules,
  Args = GetDeployWorkflowArgs<T>,
> = {
  run: (
    userArgs: Args,
    options?: MethodOptions
  ) => Promise<DeployWorkflowWriteReturnType>
  simulate: (userArgs: Args) => Promise<DeployWorkflowSimulateReturnType>
  estimateGas: (userArgs: Args) => Promise<DeployWorkflowEstimateGasReturnType>
  bytecode: (userArgs: Args) => Promise<DeployWorkflowBytecodeReturnType>
}
