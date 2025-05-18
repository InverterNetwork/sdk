import { decodeFunctionResult } from 'viem'
import { deployWorkflow } from './deploy-workflow'
import { getModule } from './get-module'
import { moduleMulticall } from './module-multicall'
import type {
  GetDeployWorkflowArgs,
  MixedRequestedModules,
  PopWalletClient,
  PopPublicClient,
} from './types'

export async function getSimulatedWorkflow<
  T extends MixedRequestedModules,
  TDeployWorkflowArgs extends GetDeployWorkflowArgs<T>,
>({
  trustedForwarderAddress,
  requestedModules,
  args,
  publicClient,
  walletClient,
}: {
  trustedForwarderAddress: `0x${string}`
  requestedModules: T
  args: TDeployWorkflowArgs
  publicClient: PopPublicClient
  walletClient: PopWalletClient
}) {
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
      _,
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
    logicModules,
    fundingManager,
    authorizer,
    paymentProcessor,
  }

  return result
}
