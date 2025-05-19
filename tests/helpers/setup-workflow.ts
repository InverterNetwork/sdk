import type {
  DeployWorkflowBytecodeReturnType,
  GetDeployWorkflowArgs,
  GetDeployWorkflowModuleArg,
  GetModuleReturnType,
  GetSimulatedWorkflowReturnType,
  MixedRequestedModules,
  PopWalletClient,
  Workflow,
  WorkflowIssuanceToken,
} from '@/types'

import {
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
  TRUSTED_FORWARDER_ADDRESS,
} from 'tests/helpers'

// WORKFLOW WITH ISSUANCE TOKEN
// -------------------------------------------------------------------------------------------------
export type SetupWorkflowWithTokenParams<
  T extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
  B extends boolean = false,
> = {
  issuanceTokenName: IT
  issuanceTokenArgs: GetDeployWorkflowModuleArg<IT>
  requestedModules: T
  workflowArgs: (
    issuanceTokenAddress: `0x${string}`
  ) => GetDeployWorkflowArgs<T>
  justBytecode?: B
}

export type SetupWorkflowWithTokenReturnType<
  T extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
  B extends boolean = false,
> = B extends true
  ? DeployWorkflowBytecodeReturnType &
      GetSimulatedWorkflowReturnType & {
        issuanceToken: GetModuleReturnType<IT, PopWalletClient>
        fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
      }
  : Workflow<T, PopWalletClient, 'ERC20Issuance_v1', IT>

// HANDLE WORKFLOW WITH ISSUANCE TOKEN DEPLOYMENT
// -------------------------------------------------------------------------------------------------
export async function setupWorkflowWithToken<
  T extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
  B extends boolean = false,
>({
  issuanceTokenName,
  issuanceTokenArgs,
  requestedModules,
  workflowArgs,
  justBytecode = false as B,
}: SetupWorkflowWithTokenParams<T, IT, B>): Promise<
  SetupWorkflowWithTokenReturnType<T, IT, B>
> {
  const { contractAddress: issuanceTokenAddress } = await sdk.deploy({
    name: issuanceTokenName,
    args: issuanceTokenArgs,
  })

  if (!issuanceTokenAddress) {
    throw new Error('Failed to deploy issuance token')
  }

  const { run, bytecode: handleBytecode } = await sdk.deployWorkflow({
    requestedModules,
  })

  if (!!justBytecode) {
    const bytecodeReturn = await handleBytecode(
      workflowArgs(issuanceTokenAddress)
    )
    const simulatedWorkflow = await sdk.getSimulatedWorkflow({
      requestedModules,
      args: workflowArgs(issuanceTokenAddress),
      trustedForwarderAddress: TRUSTED_FORWARDER_ADDRESS,
    })
    return {
      ...bytecodeReturn,
      ...simulatedWorkflow,
      issuanceToken: sdk.getModule({
        name: issuanceTokenName,
        address: issuanceTokenAddress,
        tagConfig: {
          // @ts-expect-error - ts doesn't know that issuanceTokenArgs is a module data
          decimals: issuanceTokenArgs.decimals,
          walletAddress: sdk.walletClient.account.address,
        },
      }),
      fundingToken: sdk.getModule({
        name: 'ERC20Issuance_v1',
        address: TEST_ERC20_MOCK_ADDRESS,
        tagConfig: {
          decimals: 18,
          walletAddress: sdk.walletClient.account.address,
        },
      }),
    } as any
  }

  const { orchestratorAddress } = await run(workflowArgs(issuanceTokenAddress))

  const workflow = (await sdk.getWorkflow({
    orchestratorAddress,
    requestedModules,
    issuanceTokenType: issuanceTokenName,
    fundingTokenType: 'ERC20Issuance_v1',
  })) as any

  return workflow
}

// WORKFLOW WITHOUT ISSUANCE TOKEN
// -------------------------------------------------------------------------------------------------
export type SetupWorkflowWithoutTokenParams<T extends MixedRequestedModules> = {
  requestedModules: T
  workflowArgs: GetDeployWorkflowArgs<T>
}

export type SetupWorkflowWithoutTokenReturnType<
  T extends MixedRequestedModules,
> = Workflow<T, PopWalletClient>

// HANDLE WORKFLOW WITHOUT ISSUANCE TOKEN DEPLOYMENT
// -------------------------------------------------------------------------------------------------
export async function setupWorkflowWithoutToken<
  T extends MixedRequestedModules,
>({
  requestedModules,
  workflowArgs,
}: SetupWorkflowWithoutTokenParams<T>): Promise<
  SetupWorkflowWithoutTokenReturnType<T>
> {
  const { run } = await sdk.deployWorkflow({
    requestedModules,
  })

  const { orchestratorAddress } = await run(workflowArgs)

  const workflow = sdk.getWorkflow({
    orchestratorAddress,
    requestedModules,
  })

  return workflow
}
