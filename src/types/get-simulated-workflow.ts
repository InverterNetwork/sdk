import type {
  GetDeployWorkflowArgs,
  MixedRequestedModules,
  PopPublicClient,
  PopWalletClient,
} from '@/types'

/**
 * @description The parameters for the getSimulatedWorkflow function
 * @param params.trustedForwarderAddress - The address of the trusted forwarder
 * @param params.requestedModules - The requested modules
 * @param params.args - The arguments for the workflow deployment
 * @param params.publicClient - The public client
 * @param params.walletClient - The wallet client
 * @returns The simulated workflow
 */
export type GetSimulatedWorkflowParams<
  T extends MixedRequestedModules,
  TDeployWorkflowArgs extends GetDeployWorkflowArgs<T>,
> = {
  requestedModules: T
  args: TDeployWorkflowArgs
  publicClient: PopPublicClient
  walletClient: PopWalletClient
}

/**
 * @description The return type for the getSimulatedWorkflow function
 * @param params.orchestratorAddress - The address of the orchestrator
 * @param params.authorizerAddress - The address of the authorizer
 * @param params.fundingManagerAddress - The address of the funding manager
 * @param params.paymentProcessorAddress - The address of the payment processor
 * @param params.logicModulesAddresses - The addresses of the logic modules
 * @param params.bytecode - The bytecode of the workflow
 * @param params.trustedForwarderAddress - The address of the trusted forwarder
 * @param params.factoryAddress - The address of the factory
 */
export type GetSimulatedWorkflowReturnType = {
  orchestratorAddress: `0x${string}`
  authorizerAddress: `0x${string}`
  fundingManagerAddress: `0x${string}`
  logicModuleAddresses: `0x${string}`[]
  paymentProcessorAddress: `0x${string}`
  bytecode: `0x${string}`
  trustedForwarderAddress: `0x${string}`
  factoryAddress: `0x${string}`
}
