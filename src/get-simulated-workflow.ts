import { deployWorkflow } from '@/deploy-workflow'
import { getModule } from '@/get-module'
import { moduleMulticall } from '@/module-multicall'
import type {
  DeployBytecodeReturnType,
  GetDeployWorkflowArgs,
  GetSimulatedWorkflowParams,
  GetSimulatedWorkflowReturnType,
  MixedRequestedModules,
  SingleModuleCall,
} from '@/types'
import d from 'debug'

const debug = d('inverter:get-simulated-workflow')

/**
 * @description Simulates the workflow deployment process and returns the plemenary modules addresses
 * @template TRequestedModules - The requested modules
 * @template TDeployWorkflowArgs - The arguments for the workflow deployment
 * @template TTokenBytecode - The bytecode of the token
 * @param params.trustedForwarderAddress - The address of the trusted forwarder
 * @param params.requestedModules - The requested modules
 * @param params.args - The arguments for the workflow deployment
 * @param params.publicClient - The public client
 * @param params.walletClient - The wallet client
 * @param params.tokenBytecode - The bytecode of the token
 * @returns The simulated workflow
 * * @example
 * ```ts
 * const {
 *   orchestratorAddress,
 *   logicModulesAddresses,
 *   fundingManagerAddress,
 *   authorizerAddress,
 *   paymentProcessorAddress
 *   bytecode,
 *   factoryAddress,
 *   tokenBytecode
 * } = await getSimulatedWorkflow({
 *   trustedForwarderAddress,
 *   requestedModules,
 *   args,
 *   publicClient,
 *   walletClient,
 *   tokenBytecode,
 * })
 * ```
 */
export async function getSimulatedWorkflow<
  TRequestedModules extends MixedRequestedModules,
  TDeployWorkflowArgs extends GetDeployWorkflowArgs<
    TRequestedModules,
    TUseTags
  >,
  TTokenBytecode extends DeployBytecodeReturnType | undefined = undefined,
  TUseTags extends boolean = true,
>({
  requestedModules,
  args,
  publicClient,
  walletClient,
  tokenBytecode,
  tagConfig,
  useTags,
}: GetSimulatedWorkflowParams<
  TRequestedModules,
  TDeployWorkflowArgs,
  TTokenBytecode,
  TUseTags
>): Promise<GetSimulatedWorkflowReturnType> {
  // Get the bytecode method of the deployWorkflow function
  const { bytecode, simulate } = await deployWorkflow({
    requestedModules,
    publicClient,
    walletClient,
    tagConfig,
    useTags,
  })

  // Get the result of the deployWorkflow.bytecode method
  const deployBytecode = await bytecode(args as any)
  // Get the factory module
  const factory = getModule({
    name: 'OrchestratorFactory_v1',
    address: deployBytecode.factoryAddress,
    publicClient,
    walletClient,
    useTags: useTags as false,
  })

  // Retreive the trusted forwarder address from the factory module
  const trustedForwarderAddress = await factory.read.trustedForwarder.run()
  debug('TRUSTED_FORWARDER ADDRESS:', trustedForwarderAddress)

  const tokenBytecodeData = await tokenBytecode?.run()

  const orchestratorAddress = await (async () => {
    if (tokenBytecodeData) {
      const multicall = await moduleMulticall.simulate({
        trustedForwarderAddress,
        calls: [
          {
            allowFailure: false,
            address: deployBytecode.factoryAddress,
            callData: tokenBytecodeData,
          },
          {
            allowFailure: false,
            address: deployBytecode.factoryAddress,
            callData: deployBytecode.bytecode,
          },
        ],
        walletClient,
        publicClient,
      })

      return await factory.bytecode.createOrchestrator.decodeResult(
        multicall.returnDatas[1]
      )
    }

    return (await simulate(args as any)).result
  })()

  // Get the orchestrator module
  const orchestrator = getModule({
    name: 'Orchestrator_v1',
    address: orchestratorAddress,
    publicClient,
    walletClient,
    useTags: useTags as false,
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

  let calls: SingleModuleCall[] = [
    {
      allowFailure: false,
      address: deployBytecode.factoryAddress,
      callData: deployBytecode.bytecode,
    },
    {
      allowFailure: false,
      address: orchestratorAddress,
      callData: listModulesBytecode,
    },
    {
      allowFailure: false,
      address: orchestratorAddress,
      callData: fundingManagerBytecode,
    },
    {
      allowFailure: false,
      address: orchestratorAddress,
      callData: authorizerBytecode,
    },
    {
      allowFailure: false,
      address: orchestratorAddress,
      callData: paymentProcessorBytecode,
    },
  ]

  if (tokenBytecodeData) {
    calls = [
      {
        address: deployBytecode.factoryAddress,
        allowFailure: false,
        callData: tokenBytecodeData,
      },
      ...calls,
    ]
  }

  // Simulate the multicall
  const { returnDatas } = await moduleMulticall.simulate({
    trustedForwarderAddress,
    calls,
    walletClient,
    publicClient,
  })

  const baseIndex = tokenBytecode ? 2 : 1
  const listModulesReturnData = returnDatas[baseIndex]
  const readFundingManagerReturnData = returnDatas[baseIndex + 1]
  const readAuthorizerReturnData = returnDatas[baseIndex + 2]
  const readPaymentProcessorReturnData = returnDatas[baseIndex + 3]

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
    orchestratorAddress: orchestratorAddress,
    logicModuleAddresses: logicModules,
    fundingManagerAddress: fundingManager,
    authorizerAddress: authorizer,
    paymentProcessorAddress: paymentProcessor,
    bytecode: deployBytecode.bytecode,
    factoryAddress: deployBytecode.factoryAddress,
  }

  return result
}
