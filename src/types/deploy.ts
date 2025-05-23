import type { BaseData } from '@inverter-network/abis'
import type {
  GetDeployWorkflowModuleArg,
  MethodOptions,
  PopPublicClient,
  PopWalletClient,
} from '@/index'

/**
 * @description Deployable contracts - the contracts which has a bytecode available in the registry
 */
export type DeployableContracts = Extract<
  BaseData[number],
  { deploymentInputs: { bytecode: string } }
>['name']

/**
 * @description The parameters for the contract deployment function
 * @param name - The name of the contract to deploy
 * @param walletClient - The wallet client
 * @param publicClient - The public client
 * @param args - The arguments for the deploy function
 */
export type DeployParams<T extends DeployableContracts> = {
  name: T
  walletClient: PopWalletClient
  publicClient: PopPublicClient
  args: GetDeployWorkflowModuleArg<T>
}

/**
 * @description The return type for the contract deployment's write function
 */
export type DeployWriteReturnType = {
  contractAddress: `0x${string}`
  transactionHash: `0x${string}`
}

/**
 * @description The return type for the contract deployment's bytecode function
 */
export type DeployBytecodeReturnType = {
  run: (call?: `0x${string}`[]) => Promise<`0x${string}`>
  factoryAddress: `0x${string}`
  contractAddress: `0x${string}`
}

/**
 * @description The deploy object
 */
export type Deploy = {
  write: <T extends DeployableContracts>(
    params: DeployParams<T>,
    options?: MethodOptions
  ) => Promise<DeployWriteReturnType>
  bytecode: <T extends DeployableContracts>(
    params: DeployParams<T>
  ) => Promise<DeployBytecodeReturnType>
}
