// import { decodeFunctionResult } from 'viem'
// import { deployWorkflow } from './deploy-workflow'
// import { getModule } from './get-module'
// import { moduleMulticall } from './module-multicall'
// import type {
//   GetDeployWorkflowArgs,
//   MixedRequestedModules,
//   PopWalletClient,
//   PopPublicClient,
// } from './types'
// import { getModuleData } from '@inverter-network/abis'

// export async function getSimulatedWorkflow<
//   T extends MixedRequestedModules,
//   TDeployWorkflowArgs extends GetDeployWorkflowArgs<T>,
// >({
//   trustedForwarderAddress,
//   requestedModules,
//   args,
//   publicClient,
//   walletClient,
// }: {
//   trustedForwarderAddress: `0x${string}`
//   requestedModules: T
//   args: TDeployWorkflowArgs
//   publicClient: PopPublicClient
//   walletClient: PopWalletClient
// }) {
//   const { bytecode } = await deployWorkflow({
//     requestedModules,
//     publicClient,
//     walletClient,
//   })

//   const deployBytecode = await bytecode(args)

//   const orchestrator = getModule({
//     name: 'Orchestrator_v1',
//     address: deployBytecode.orchestratorAddress,
//     publicClient,
//     walletClient,
//   })

//   const multicallData = await publicClient.multicall({
//     contracts: [
//       {
//         abi: getModuleData('OrchestratorFactory_v1').abi,
//         address: deployBytecode.factoryAddress,
//         functionName: 'createOrchestrator',
//         args: deployBytecode.rawArgs,
//       },
//       {
//         abi: orchestrator.abi,
//         address: deployBytecode.orchestratorAddress,
//         functionName: 'listModules',
//       },
//       {
//         abi: orchestrator.abi,
//         address: deployBytecode.orchestratorAddress,
//         functionName: 'fundingManager',
//       },
//       {
//         abi: orchestrator.abi,
//         address: deployBytecode.orchestratorAddress,
//         functionName: 'authorizer',
//       },
//       {
//         abi: orchestrator.abi,
//         address: deployBytecode.orchestratorAddress,
//         functionName: 'paymentProcessor',
//       },
//     ],
//   })

//   console.log('MULTICALL_DATA', multicallData)

//   const logicModules = multicallData[1].result?.filter(
//     (module) =>
//       ![
//         multicallData[2].result,
//         multicallData[3].result,
//         multicallData[4].result,
//       ].includes(module)
//   )

//   const result = {
//     factoryAddress: deployBytecode.factoryAddress,
//     createOrchestratorBytecode: deployBytecode.bytecode,
//     orchestratorAddress: deployBytecode.orchestratorAddress,
//     logicModuleAddresses: logicModules,
//     fundingManagerAddress: multicallData[2].result,
//     authorizerAddress: multicallData[3].result,
//     paymentProcessorAddress: multicallData[4].result,
//   }

//   console.log('RESULT', result)

//   return result
// }
