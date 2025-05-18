import type {
  GetDeployWorkflowArgs,
  GetDeployWorkflowModuleArg,
  MixedRequestedModules,
  PopWalletClient,
  Workflow,
  WorkflowIssuanceToken,
} from '@/types'

import { sdk } from 'tests/helpers'

// WORKFLOW WITH ISSUANCE TOKEN
// -------------------------------------------------------------------------------------------------
export type SetupWorkflowWithTokenParams<
  T extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
> = {
  issuanceTokenName: IT
  issuanceTokenArgs: GetDeployWorkflowModuleArg<IT>
  requestedModules: T
  workflowArgs: (
    issuanceTokenAddress: `0x${string}`
  ) => GetDeployWorkflowArgs<T>
}

export type SetupWorkflowWithTokenReturnType<
  T extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
> = Workflow<T, PopWalletClient, 'ERC20Issuance_v1', IT>

// HANDLE WORKFLOW WITH ISSUANCE TOKEN DEPLOYMENT
// -------------------------------------------------------------------------------------------------
export async function setupWorkflowWithToken<
  T extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
>({
  issuanceTokenName,
  issuanceTokenArgs,
  requestedModules,
  workflowArgs,
}: SetupWorkflowWithTokenParams<T, IT>): Promise<
  SetupWorkflowWithTokenReturnType<T, IT>
> {
  const { contractAddress: issuanceTokenAddress } = await sdk.deploy({
    name: issuanceTokenName,
    args: issuanceTokenArgs,
  })

  if (!issuanceTokenAddress) {
    throw new Error('Failed to deploy issuance token')
  }

  const { run } = await sdk.deployWorkflow({
    requestedModules,
  })

  const { orchestratorAddress } = await run(workflowArgs(issuanceTokenAddress))

  const workflow = await sdk.getWorkflow({
    orchestratorAddress,
    requestedModules,
    issuanceTokenType: issuanceTokenName,
    fundingTokenType: 'ERC20Issuance_v1',
  })

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
