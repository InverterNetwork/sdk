import type { GetDeployWorkflowArgs, RequestedModules, Workflow } from '@/index'
import { beforeEach, describe, expect, it } from 'bun:test'
import {
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'
import { parseUnits } from 'viem'

describe('#USE_TAGS_FLAG', () => {
  // CONSTANTS
  // --------------------------------------------------
  const deployer = sdk.walletClient.account.address
  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_DepositVault_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules

  const args = {
    authorizer: {
      initialAdmin: deployer,
    },
    fundingManager: {
      orchestratorTokenAddress: TEST_ERC20_MOCK_ADDRESS,
    },
    orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
  } as const satisfies GetDeployWorkflowArgs<typeof requestedModules>

  // VARIABLES
  // --------------------------------------------------
  let noTagsWorkflow: Workflow<
    typeof requestedModules,
    typeof sdk.walletClient,
    'ERC20',
    undefined,
    false
  >

  let tagsWorkflow: Workflow<
    typeof requestedModules,
    typeof sdk.walletClient,
    'ERC20',
    undefined,
    true
  >

  beforeEach(async () => {
    const orchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
        })
      ).run(args)
    ).orchestratorAddress

    noTagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: orchestratorAddress,
      requestedModules,
      useTags: false,
    })

    tagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: orchestratorAddress,
      requestedModules,
      useTags: true,
    })

    const token = sdk.getModule({
      address: TEST_ERC20_MOCK_ADDRESS,
      name: 'ERC20Issuance_v1',
    })

    await token.write.mint.run([deployer, '1000'])
  })

  it('1. Should deposit to the vault, without tags', async () => {
    const hash = await noTagsWorkflow.fundingManager.write.deposit.run('1000')
    const balance = await noTagsWorkflow.fundingToken.module.read.balanceOf.run(
      noTagsWorkflow.orchestrator.address
    )

    expect(hash).toBeString()
    expect(balance).toBe(parseUnits('1000', 18))
  })

  it('2. Should deposit to the vault, with tags', async () => {
    const hash = await tagsWorkflow.fundingManager.write.deposit.run('1000')
    const balance = await tagsWorkflow.fundingToken.module.read.balanceOf.run(
      tagsWorkflow.orchestrator.address
    )

    expect(hash).toBeString()
    expect(balance).toBe('1000')
  })
})
