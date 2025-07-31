import type { GetDeployWorkflowArgs, RequestedModules, Workflow } from '@/index'
import { beforeAll, describe, expect, it } from 'bun:test'
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
    'ERC20Issuance_v1',
    undefined,
    false
  >

  let tagsWorkflow: Workflow<
    typeof requestedModules,
    typeof sdk.walletClient,
    'ERC20Issuance_v1',
    undefined,
    true
  >

  beforeAll(async () => {
    const orchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
        })
      ).run(args)
    ).orchestratorAddress

    tagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: orchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      useTags: true,
    })

    noTagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: orchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      useTags: false,
    })

    await tagsWorkflow.fundingToken.module.write.mint.run([deployer, '2000'])
    const balance =
      await tagsWorkflow.fundingToken.module.read.balanceOf.run(deployer)
    console.log('DEPLOYER_BALANCE', balance)
  })

  it('WITH_TAGS: Should get transaction hash of deposit', async () => {
    const hash = await tagsWorkflow.fundingManager.write.deposit.run('1000')
    expect(hash).toBeString()
  })

  it('WITH_TAGS: Should have correct balance after depositing', async () => {
    const balance = await tagsWorkflow.fundingToken.module.read.balanceOf.run(
      tagsWorkflow.fundingManager.address
    )
    expect(balance).toBe('990')
  })

  it('WITHOUT_TAGS: Should get transaction hash of deposit', async () => {
    const amount = parseUnits('1000', 18)
    const approveHash =
      await noTagsWorkflow.fundingToken.module.write.approve.run([
        noTagsWorkflow.fundingManager.address,
        amount,
      ])
    expect(approveHash).toBeString()
    const depositHash = await noTagsWorkflow.fundingManager.write.deposit.run([
      amount,
    ])
    expect(depositHash).toBeString()
  })

  it('WITHOUT_TAGS: Should have correct balance after depositing', async () => {
    const balance = await noTagsWorkflow.fundingToken.module.read.balanceOf.run(
      [noTagsWorkflow.fundingManager.address]
    )
    expect(balance).toBe(parseUnits(String(990 * 2), 18))
  })
})
