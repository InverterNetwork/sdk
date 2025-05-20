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
export type DeployWriteParams<T extends DeployableContracts> = {
  name: T
  walletClient: PopWalletClient
  publicClient: PopPublicClient
  args: GetDeployWorkflowModuleArg<T>
}

export type DeployBytecodeParams<T extends DeployableContracts> = Omit<
  Omit<DeployWriteParams<T>, 'args'>,
  'walletClient'
>

/**
 * @description The return type for the contract deployment's write function
 */
export type DeployWriteReturnType = {
  contractAddress: `0x${string}`
  transactionHash: `0x${string}`
}

/**
 * @description The parameters for the contract deployment's bytecode runner function
 */
export type DeployBytecodeRunParams<T extends DeployableContracts> = {
  args: GetDeployWorkflowModuleArg<T>
  calls?: `0x${string}`[]
}

/**
 * @description The return type for the contract deployment's bytecode function
 */
export type DeployBytecodeReturnType<T extends DeployableContracts> = {
  run: (params: DeployBytecodeRunParams<T>) => Promise<`0x${string}`>
  factoryAddress: `0x${string}`
  contractAddress: `0x${string}`
}

export type Deploy = {
  write: <T extends DeployableContracts>(
    params: DeployWriteParams<T>,
    options?: MethodOptions
  ) => Promise<DeployWriteReturnType>
  bytecode: <T extends DeployableContracts>(
    params: DeployBytecodeParams<T>
  ) => Promise<DeployBytecodeReturnType<T>>
}
