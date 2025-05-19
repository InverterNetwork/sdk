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
 * @param params.logicModulesAddresses - The addresses of the logic modules
 * @param params.fundingManagerAddress - The address of the funding manager
 * @param params.authorizerAddress - The address of the authorizer
 * @param params.paymentProcessorAddress - The address of the payment processor
 */
export type GetSimulatedWorkflowReturnType = {
  trustedForwarderAddress: `0x${string}`
  orchestratorAddress: `0x${string}`
  logicModulesAddresses: `0x${string}`[]
  fundingManagerAddress: `0x${string}`
  authorizerAddress: `0x${string}`
  paymentProcessorAddress: `0x${string}`
}
