// external dependencies
import type { PublicClient, SimulateContractReturnType } from 'viem'

// sdk types
import type { Inverter } from '@/inverter'

import type {
  GetDeployWorkflowArgs,
  MethodOptions,
  PopWalletClient,
  RequestedModules,
  FactoryType,
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
 * @description Parameters for the getMothods util of deployWorkflow function
 */
export type GetMethodsParams<
  T extends RequestedModules,
  FT extends FactoryType,
> = {
  requestedModules: T
  factoryType: FT
  publicClient: PublicClient
  walletClient: PopWalletClient
  self?: Inverter
}

/**
 * @description Return type for the getMothods util of deployWorkflow function
 */
export type GetMethodsReturnType<
  T extends RequestedModules,
  FT extends FactoryType,
  Args = GetDeployWorkflowArgs<T, FT>,
> = {
  run: (
    userArgs: Args,
    options?: MethodOptions
  ) => Promise<DeployWorkflowWriteReturnType>
  simulate: (userArgs: Args) => Promise<DeployWorkflowSimulateReturnType>
  estimateGas: (userArgs: Args) => Promise<DeployWorkflowEstimateGasReturnType>
}
