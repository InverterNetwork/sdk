import { decodeFunctionResult } from 'viem'
import { deployWorkflow } from '@/deploy-workflow'
import { getModule } from '@/get-module'
import { moduleMulticall } from '@/module-multicall'
import type {
  GetDeployWorkflowArgs,
  MixedRequestedModules,
  GetSimulatedWorkflowParams,
  GetSimulatedWorkflowReturnType,
} from '@/types'

/**
 * @description Simulates the workflow deployment process and returns the plemenary modules addresses
 * @example
 * ```ts
 * const { orchestratorAddress, logicModulesAddresses, fundingManagerAddress, authorizerAddress, paymentProcessorAddress } = await getSimulatedWorkflow({
 *   trustedForwarderAddress,
 *   requestedModules,
 *   args,
 *   publicClient,
 *   walletClient,
 * })
 * ```
 * @param params.trustedForwarderAddress - The address of the trusted forwarder
 * @param params.requestedModules - The requested modules
 * @param params.args - The arguments for the workflow deployment
 * @param params.publicClient - The public client
 * @param params.walletClient - The wallet client
 * @returns The simulated workflow
 */
export async function getSimulatedWorkflow<
  T extends MixedRequestedModules,
  TDeployWorkflowArgs extends GetDeployWorkflowArgs<T>,
>({
  trustedForwarderAddress,
  requestedModules,
  args,
  publicClient,
  walletClient,
}: GetSimulatedWorkflowParams<
  T,
  TDeployWorkflowArgs
>): Promise<GetSimulatedWorkflowReturnType> {
  const { bytecode } = await deployWorkflow({
    requestedModules,
    publicClient,
    walletClient,
  })

  const deployBytecode = await bytecode(args)

  const orchestrator = getModule({
    name: 'Orchestrator_v1',
    address: deployBytecode.orchestratorAddress,
    publicClient,
    walletClient,
  })

  const listModulesBytecode = await orchestrator.bytecode.listModules.run()
  const fundingManagerBytecode =
    await orchestrator.bytecode.fundingManager.run()
  const authorizerBytecode = await orchestrator.bytecode.authorizer.run()
  const paymentProcessorBytecode =
    await orchestrator.bytecode.paymentProcessor.run()

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

  const [listedModules, fundingManager, authorizer, paymentProcessor] = [
    decodeFunctionResult({
      abi: orchestrator.abi,
      data: listModulesReturnData,
      functionName: 'listModules',
    }),
    decodeFunctionResult({
      abi: orchestrator.abi,
      data: readFundingManagerReturnData,
      functionName: 'fundingManager',
    }),
    decodeFunctionResult({
      abi: orchestrator.abi,
      data: readAuthorizerReturnData,
      functionName: 'authorizer',
    }),
    decodeFunctionResult({
      abi: orchestrator.abi,
      data: readPaymentProcessorReturnData,
      functionName: 'paymentProcessor',
    }),
  ]

  const logicModules = listedModules.filter(
    (module) => ![fundingManager, authorizer, paymentProcessor].includes(module)
  )

  const result = {
    orchestratorAddress: deployBytecode.orchestratorAddress,
    logicModulesAddresses: logicModules,
    fundingManagerAddress: fundingManager,
    authorizerAddress: authorizer,
    paymentProcessorAddress: paymentProcessor,
  }

  return result
}
