import { deployWorkflow } from '@/deploy-workflow'
import { getModule } from '@/get-module'
import { moduleMulticall } from '@/module-multicall'
import type {
  GetDeployWorkflowArgs,
  GetSimulatedWorkflowParams,
  GetSimulatedWorkflowReturnType,
  MixedRequestedModules,
  SimulatedWorkflowToken,
} from '@/types'

import { deploy } from './deploy'

/**
 * @description Simulates the workflow deployment process and returns the plemenary modules addresses
 * @param params.trustedForwarderAddress - The address of the trusted forwarder
 * @param params.requestedModules - The requested modules
 * @param params.args - The arguments for the workflow deployment
 * @param params.publicClient - The public client
 * @param params.walletClient - The wallet client
 * @returns The simulated workflow
 * * @example
 * ```ts
 * const {
 *   orchestratorAddress,
 *   logicModulesAddresses,
 *   fundingManagerAddress,
 *   authorizerAddress,
 *   paymentProcessorAddress
 * } = await getSimulatedWorkflow({
 *   trustedForwarderAddress,
 *   requestedModules,
 *   args,
 *   publicClient,
 *   walletClient,
 * })
 * ```
 */
export async function getSimulatedWorkflow<
  T extends MixedRequestedModules,
  TDeployWorkflowArgs extends GetDeployWorkflowArgs<T>,
  TToken extends SimulatedWorkflowToken = undefined,
>({
  requestedModules,
  args,
  publicClient,
  walletClient,
  token,
}: GetSimulatedWorkflowParams<T, TDeployWorkflowArgs, TToken>): Promise<
  GetSimulatedWorkflowReturnType<TToken>
> {
  // Get the bytecode method of the deployWorkflow function
  const { bytecode } = await deployWorkflow({
    requestedModules,
    publicClient,
    walletClient,
  })

  // Get the result of the deployWorkflow.bytecode method
  const deployBytecode = await bytecode(args)

  // Get the factory module
  const factory = getModule({
    name: 'OrchestratorFactory_v1',
    address: deployBytecode.factoryAddress,
    publicClient,
    walletClient,
  })

  // Retreive the trusted forwarder address from the factory module
  const trustedForwarderAddress = await factory.read.trustedForwarder.run()

  // Get the orchestrator module
  const orchestrator = getModule({
    name: 'Orchestrator_v1',
    address: deployBytecode.orchestratorAddress,
    publicClient,
    walletClient,
  })

  // Get the bytecode of the listModules method
  const listModulesBytecode = await orchestrator.bytecode.listModules.run()
  // Get the bytecode of the fundingManager method
  const fundingManagerBytecode =
    await orchestrator.bytecode.fundingManager.run()
  // Get the bytecode of the authorizer method
  const authorizerBytecode = await orchestrator.bytecode.authorizer.run()
  // Get the bytecode of the paymentProcessor method
  const paymentProcessorBytecode =
    await orchestrator.bytecode.paymentProcessor.run()

  // Simulate the multicall
  const {
    returnDatas: [
      ,
      listModulesReturnData,
      readFundingManagerReturnData,
      readAuthorizerReturnData,
      readPaymentProcessorReturnData,
    ],
  } = await moduleMulticall.simulate({
    trustedForwarderAddress,
    call: [
      {
        allowFailure: false,
        address: deployBytecode.factoryAddress,
        callData: deployBytecode.bytecode,
      },
      {
        allowFailure: false,
        address: deployBytecode.orchestratorAddress,
        callData: listModulesBytecode,
      },
      {
        allowFailure: false,
        address: deployBytecode.orchestratorAddress,
        callData: fundingManagerBytecode,
      },
      {
        allowFailure: false,
        address: deployBytecode.orchestratorAddress,
        callData: authorizerBytecode,
      },
      {
        allowFailure: false,
        address: deployBytecode.orchestratorAddress,
        callData: paymentProcessorBytecode,
      },
    ],
    walletClient,
    publicClient,
  })

  // Decode the results of the multicall
  const [listedModules, fundingManager, authorizer, paymentProcessor] = [
    await orchestrator.bytecode.listModules.decodeResult(listModulesReturnData),
    await orchestrator.bytecode.fundingManager.decodeResult(
      readFundingManagerReturnData
    ),
    await orchestrator.bytecode.authorizer.decodeResult(
      readAuthorizerReturnData
    ),
    await orchestrator.bytecode.paymentProcessor.decodeResult(
      readPaymentProcessorReturnData
    ),
  ]

  // Get the logic modules addresses
  const logicModules = listedModules.filter(
    (module) => ![fundingManager, authorizer, paymentProcessor].includes(module)
  )

  // Return the result
  const result = {
    trustedForwarderAddress,
    orchestratorAddress: deployBytecode.orchestratorAddress,
    logicModuleAddresses: logicModules,
    fundingManagerAddress: fundingManager,
    authorizerAddress: authorizer,
    paymentProcessorAddress: paymentProcessor,
    bytecode: deployBytecode.bytecode,
    factoryAddress: deployBytecode.factoryAddress,
  }
  // If a token is provided, add the token bytecode and address to the result
  if (token) {
    const tokenDeployment = await deploy.bytecode({
      publicClient,
      ...token,
      args: token.args as any,
    })

    Object.assign(result, {
      tokenBytecode: tokenDeployment.bytecode,
      tokenAddress: tokenDeployment.contractAddress,
    })
  }

  return result as GetSimulatedWorkflowReturnType<TToken>
}
