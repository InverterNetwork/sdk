import { deployWorkflow } from '@/deploy-workflow'
import { getModule } from '@/get-module'
import { moduleMulticall } from '@/module-multicall'
import type {
  GetDeployWorkflowArgs,
  GetSimulatedWorkflowParams,
  GetSimulatedWorkflowReturnType,
  MixedRequestedModules,
  ModuleMulticallCall,
  SimulatedWorkflowToken,
} from '@/types'
import d from 'debug'

import { deploy } from './deploy'

const debug = d('inverter:get-simulated-workflow')

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
  tagConfig,
}: GetSimulatedWorkflowParams<T, TDeployWorkflowArgs, TToken>): Promise<
  GetSimulatedWorkflowReturnType<TToken>
> {
  debug('BEFORE_DEPLOY_WORKFLOW')
  // Get the bytecode method of the deployWorkflow function
  const { bytecode, simulate } = await deployWorkflow({
    requestedModules,
    publicClient,
    walletClient,
    tagConfig,
  })
  debug('AFTER_DEPLOY_WORKFLOW')

  // Get the result of the deployWorkflow.bytecode method
  const deployBytecode = await bytecode(args)
  debug('AFTER_DEPLOY_WORKFLOW_BYTECODE')
  // Get the factory module
  const factory = getModule({
    name: 'OrchestratorFactory_v1',
    address: deployBytecode.factoryAddress,
    publicClient,
    walletClient,
  })

  // Retreive the trusted forwarder address from the factory module
  const trustedForwarderAddress = await factory.read.trustedForwarder.run()
  debug('TRUSTED_FORWARDER_ADDRESS', trustedForwarderAddress)

  let tokenBytecode: `0x${string}` | null = null
  let tokenAddress: `0x${string}` | null = null

  // If a token is provided, add the token bytecode and address to the result
  if (token) {
    const tokenDeployment = await deploy.bytecode({
      publicClient,
      name: token.name,
    })
    tokenBytecode = await tokenDeployment.run({
      args: token.args,
      calls: token.calls,
    })
    tokenAddress = tokenDeployment.contractAddress
    debug('GOT_TOKEN_BYTECODE_AND_ADDRESS', tokenAddress)
  }

  const orchestratorAddress = await (async () => {
    if (tokenBytecode) {
      const multicall = await moduleMulticall.simulate({
        trustedForwarderAddress,
        call: [
          {
            allowFailure: false,
            address: deployBytecode.factoryAddress,
            callData: tokenBytecode,
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

    return (await simulate(args)).result
  })()

  // Get the orchestrator module
  const orchestrator = getModule({
    name: 'Orchestrator_v1',
    address: orchestratorAddress,
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
  debug('GOT_ALL_WORKFLOW_BYTECODES')

  let call: ModuleMulticallCall = [
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

  if (tokenBytecode) {
    call = [
      {
        address: deployBytecode.factoryAddress,
        allowFailure: false,
        callData: tokenBytecode,
      },
      ...call,
    ]
  }

  // Simulate the multicall
  const { returnDatas } = await moduleMulticall.simulate({
    trustedForwarderAddress,
    call,
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

  if (tokenBytecode && tokenAddress) {
    Object.assign(result, {
      tokenAddress,
      tokenBytecode,
    })
  }

  return result as GetSimulatedWorkflowReturnType<TToken>
}
