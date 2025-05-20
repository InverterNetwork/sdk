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
import { sdk, TEST_ERC20_MOCK_ADDRESS } from 'tests/helpers'

// WORKFLOW WITH ISSUANCE TOKEN
// -------------------------------------------------------------------------------------------------
export type SetupWorkflowWithTokenParams<
  TRequestedModules extends MixedRequestedModules,
  TWorkflowIssuanceToken extends WorkflowIssuanceToken,
  TBytecodeOnly extends boolean = false,
> = {
  issuanceTokenName: TWorkflowIssuanceToken
  issuanceTokenArgs: GetDeployWorkflowModuleArg<TWorkflowIssuanceToken>
  requestedModules: TRequestedModules
  workflowArgs: (
    issuanceTokenAddress: `0x${string}`
  ) => GetDeployWorkflowArgs<TRequestedModules>
  justBytecode?: TBytecodeOnly
}

export type SetupWorkflowWithTokenReturnType<
  TRequestedModules extends MixedRequestedModules,
  TWorkflowIssuanceToken extends WorkflowIssuanceToken,
  TBytecodeOnly extends boolean = false,
> = TBytecodeOnly extends true
  ? DeployWorkflowBytecodeReturnType &
      GetSimulatedWorkflowReturnType & {
        issuanceToken: GetModuleReturnType<
          TWorkflowIssuanceToken,
          PopWalletClient
        >
        fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
      }
  : Workflow<
      TRequestedModules,
      PopWalletClient,
      'ERC20Issuance_v1',
      TWorkflowIssuanceToken
    >

// HANDLE WORKFLOW WITH ISSUANCE TOKEN DEPLOYMENT
// -------------------------------------------------------------------------------------------------
export async function setupWorkflowWithToken<
  TRequestedModules extends MixedRequestedModules,
  IT extends WorkflowIssuanceToken,
  B extends boolean = false,
>({
  issuanceTokenName,
  issuanceTokenArgs,
  requestedModules,
  workflowArgs,
  justBytecode = false as B,
}: SetupWorkflowWithTokenParams<TRequestedModules, IT, B>): Promise<
  SetupWorkflowWithTokenReturnType<TRequestedModules, IT, B>
> {
  const { contractAddress: issuanceTokenAddress } = await sdk.deploy.write({
    name: issuanceTokenName,
    args: issuanceTokenArgs,
  })

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
export type SetupWorkflowWithoutTokenParams<
  TRequestedModules extends MixedRequestedModules,
> = {
  requestedModules: TRequestedModules
  workflowArgs: GetDeployWorkflowArgs<TRequestedModules>
}

export type SetupWorkflowWithoutTokenReturnType<
  TRequestedModules extends MixedRequestedModules,
> = Workflow<TRequestedModules, PopWalletClient>

// HANDLE WORKFLOW WITHOUT ISSUANCE TOKEN DEPLOYMENT
// -------------------------------------------------------------------------------------------------
export async function setupWorkflowWithoutToken<
  TRequestedModules extends MixedRequestedModules,
>({
  requestedModules,
  workflowArgs,
}: SetupWorkflowWithoutTokenParams<TRequestedModules>): Promise<
  SetupWorkflowWithoutTokenReturnType<TRequestedModules>
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
