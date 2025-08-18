import type { GetDeployWorkflowArgs, RequestedModules, Workflow } from '@/index'
import { describe, expect, it } from 'bun:test'
import {
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TEST_BANCOR_FORMULA_ADDRESS,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'
import { parseUnits } from 'viem'

describe('#USE_TAGS_FLAG', () => {
  // CONSTANTS
  // --------------------------------------------------
  const deployer = sdk.walletClient.account.address
  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules

  const getArgs = <TUseTags extends boolean>(
    issuanceTokenAddress: `0x${string}`,
    useTags: TUseTags
  ) => {
    return {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        bondingCurveParams: {
          buyFee: useTags ? '0' : 0n,
          sellFee: useTags ? '0' : 0n,
          formula: TEST_BANCOR_FORMULA_ADDRESS,
          reserveRatioForBuying: 333_333,
          reserveRatioForSelling: 333_333,
          buyIsOpen: true,
          sellIsOpen: true,
          initialIssuanceSupply: useTags ? '200002' : parseUnits('200002', 18),
          initialCollateralSupply: useTags ? '296' : parseUnits('296', 18),
        },
        issuanceToken: issuanceTokenAddress,
        collateralToken: TEST_ERC20_MOCK_ADDRESS,
      },
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as GetDeployWorkflowArgs<typeof requestedModules, TUseTags>
  }

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

  const deployToken = () =>
    sdk.deploy.write({
      name: 'ERC20Issuance_v1',
      args: {
        decimals: 18,
        maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
        symbol: 'TEST',
        name: 'TestToken',
      },
    })

  it('WITH_TAGS: Should deploy token & workflow', async () => {
    const { contractAddress: tagsIssuanceTokenAddress } = await deployToken()
    const tagsOrchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
        })
      ).run(getArgs(tagsIssuanceTokenAddress, true))
    ).orchestratorAddress
    tagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: tagsOrchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      useTags: true,
    })
  })

  it('WITHOUT_TAGS: Should deploy token & workflow', async () => {
    const { contractAddress: noTagsIssuanceTokenAddress } = await deployToken()
    const noTagsOrchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
          useTags: false,
        })
      ).run(getArgs(noTagsIssuanceTokenAddress, false))
    ).orchestratorAddress
    noTagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: noTagsOrchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      issuanceTokenType: 'ERC20Issuance_v1',
      useTags: false,
    })
  })

  it('INTERMEDIATE: Should mint funding token', async () => {
    // MINT FUNDING TOKEN
    await tagsWorkflow.fundingToken.module.write.mint.run([deployer, '2000'])
    // --------------------------------------------------
    // SET MINTER FOR BOTH WORKFLOWS
    await tagsWorkflow.issuanceToken.module.write.setMinter.run([
      tagsWorkflow.fundingManager.address,
      true,
    ])
    await noTagsWorkflow.issuanceToken.module.write.setMinter.run([
      noTagsWorkflow.fundingManager.address,
      true,
    ])
  })

  // --------------------------------------------------
  // WITH_TAGS
  let withTagsPurchaseReturn: string
  it('WITH_TAGS: Should read purchase return', async () => {
    withTagsPurchaseReturn =
      await tagsWorkflow.fundingManager.read.calculatePurchaseReturn.run('1000')
    expect(Number(withTagsPurchaseReturn)).toBeGreaterThan(0)
    expect(typeof withTagsPurchaseReturn).toBe('string')
  })

  it('WITH_TAGS: Should get transaction hash of a buy', async () => {
    const hash = await tagsWorkflow.fundingManager.write.buy.run([
      '1000',
      withTagsPurchaseReturn,
    ])
    expect(hash).toBeString()
  })

  // --------------------------------------------------
  // WITHOUT_TAGS
  let withoutTagsPurchaseReturn: bigint
  it('WITHOUT_TAGS: Should read purchase return', async () => {
    withoutTagsPurchaseReturn =
      await noTagsWorkflow.fundingManager.read.calculatePurchaseReturn.run([
        parseUnits('1000', 18),
      ])
    expect(Number(withoutTagsPurchaseReturn)).toBeGreaterThan(0)
    expect(typeof withoutTagsPurchaseReturn).toBe('bigint')
  })

  it('WITHOUT_TAGS: Should approve funding token', async () => {
    const hash = await noTagsWorkflow.fundingToken.module.write.approve.run([
      noTagsWorkflow.fundingManager.address,
      parseUnits('1000', 18),
    ])
    expect(hash).toBeString()
  })

  it('WITHOUT_TAGS: Should get transaction hash of a buy', async () => {
    const hash = await noTagsWorkflow.fundingManager.write.buy.run([
      parseUnits('1000', 18),
      withoutTagsPurchaseReturn,
    ])
    expect(hash).toBeString()
  })
})
