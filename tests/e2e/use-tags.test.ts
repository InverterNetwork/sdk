import {
  UINT_MAX_SUPPLY,
  type GetDeployWorkflowArgs,
  type RequestedModules,
  type Workflow,
} from '@/index'
import { beforeAll, describe, expect, it } from 'bun:test'
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

  // STATE
  // --------------------------------------------------
  let withTagsWorkflow: Workflow<
    typeof requestedModules,
    typeof sdk.walletClient,
    'ERC20Issuance_v1',
    undefined,
    true
  >
  let withoutTagsWorkflow: Workflow<
    typeof requestedModules,
    typeof sdk.walletClient,
    'ERC20Issuance_v1',
    undefined,
    false
  >

  const deployToken = <TUseTags extends boolean>(useTags: TUseTags) =>
    sdk.deploy.write({
      name: 'ERC20Issuance_v1',
      useTags,
      args: {
        decimals: 18,
        // @ts-expect-error - This is a workaround to allow the test to pass
        maxSupply: useTags
          ? GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18)
          : UINT_MAX_SUPPLY,
        symbol: 'TEST',
        name: 'TestToken',
      },
    })

  let withTagsIssuanceTokenAddress: `0x${string}`
  let withoutTagsIssuanceTokenAddress: `0x${string}`

  // SETUP
  // --------------------------------------------------
  beforeAll(async () => {
    // WITH_TAGS deployment
    withTagsIssuanceTokenAddress = (await deployToken(true)).contractAddress
    const withTagsOrchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
        })
      ).run(getArgs(withTagsIssuanceTokenAddress, true))
    ).orchestratorAddress
    withTagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: withTagsOrchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      useTags: true,
    })

    // WITHOUT_TAGS deployment
    withoutTagsIssuanceTokenAddress = (await deployToken(false)).contractAddress
    const withoutTagsOrchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
          useTags: false,
        })
      ).run(getArgs(withoutTagsIssuanceTokenAddress, false))
    ).orchestratorAddress
    withoutTagsWorkflow = await sdk.getWorkflow({
      orchestratorAddress: withoutTagsOrchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      issuanceTokenType: 'ERC20Issuance_v1',
      useTags: false,
    })
  })

  beforeAll(async () => {
    // Mint funding token for WITH_TAGS and set minters for both workflows
    await withTagsWorkflow.fundingToken.module.write.mint.run([
      deployer,
      '4000',
    ])
    await withTagsWorkflow.issuanceToken.module.write.setMinter.run([
      withTagsWorkflow.fundingManager.address,
      true,
    ])
    await withoutTagsWorkflow.issuanceToken.module.write.setMinter.run([
      withoutTagsWorkflow.fundingManager.address,
      true,
    ])
  })

  // TESTS
  // --------------------------------------------------
  describe('WITH_TAGS', () => {
    it('Should confirm token max supply', async () => {
      const maxSupply =
        await withTagsWorkflow.issuanceToken.module.read.cap.run()
      expect(maxSupply).toBe(GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18))
    })

    let withTagsPurchaseReturn: string

    it('Should read purchase return', async () => {
      withTagsPurchaseReturn =
        await withTagsWorkflow.fundingManager.read.calculatePurchaseReturn.run(
          '1000'
        )
      expect(Number(withTagsPurchaseReturn)).toBeGreaterThan(0)
      expect(typeof withTagsPurchaseReturn).toBe('string')
    })

    it('Should get transaction hash of a buy', async () => {
      const hash = await withTagsWorkflow.fundingManager.write.buy.run([
        '1000',
        withTagsPurchaseReturn,
      ])
      expect(hash).toBeString()
    })

    it('Should deploy with multicall', async () => {
      const args = getArgs(withTagsIssuanceTokenAddress, true)
      const simulatedWorkflow = await sdk.getSimulatedWorkflow({
        requestedModules,
        args,
      })

      await withTagsWorkflow.issuanceToken.module.write.setMinter.run([
        simulatedWorkflow.fundingManagerAddress,
        true,
      ])

      await withTagsWorkflow.fundingToken.module.write.approve.run([
        simulatedWorkflow.fundingManagerAddress,
        '1000',
      ])

      const result = await sdk.moduleMulticall.write({
        trustedForwarderAddress: simulatedWorkflow.trustedForwarderAddress,
        calls: [
          {
            address: simulatedWorkflow.factoryAddress,
            allowFailure: false,
            callData: simulatedWorkflow.bytecode,
          },
          {
            address: simulatedWorkflow.fundingManagerAddress,
            allowFailure: false,
            callData: await withTagsWorkflow.fundingManager.bytecode.buy.run([
              '1000',
              '1',
            ]),
          },
          {
            address: simulatedWorkflow.fundingManagerAddress,
            allowFailure: false,
            callData:
              await withTagsWorkflow.fundingManager.bytecode.calculatePurchaseReturn.run(
                '1000'
              ),
          },
        ],
      })

      expect(result.returnDatas[0]).toBeString()
      expect(
        typeof (await withTagsWorkflow.fundingManager.bytecode.calculatePurchaseReturn.decodeResult(
          result.returnDatas[2]
        ))
      ).toBe('string')
    })
  })

  describe('WITHOUT_TAGS', () => {
    it('Should confirm token max supply', async () => {
      const maxSupply =
        await withoutTagsWorkflow.issuanceToken.module.read.cap.run()
      expect(maxSupply).toBe(UINT_MAX_SUPPLY)
    })

    let withoutTagsPurchaseReturn: bigint

    it('Should read purchase return', async () => {
      withoutTagsPurchaseReturn =
        await withoutTagsWorkflow.fundingManager.read.calculatePurchaseReturn.run(
          [parseUnits('1000', 18)]
        )
      expect(Number(withoutTagsPurchaseReturn)).toBeGreaterThan(0)
      expect(typeof withoutTagsPurchaseReturn).toBe('bigint')
    })

    it('Should approve funding token', async () => {
      const hash =
        await withoutTagsWorkflow.fundingToken.module.write.approve.run([
          withoutTagsWorkflow.fundingManager.address,
          parseUnits('1000', 18),
        ])
      expect(hash).toBeString()
    })

    it('Should get transaction hash of a buy', async () => {
      const hash = await withoutTagsWorkflow.fundingManager.write.buy.run([
        parseUnits('1000', 18),
        withoutTagsPurchaseReturn,
      ])
      expect(hash).toBeString()
    })

    it('Should deploy with multicall', async () => {
      const args = getArgs(withoutTagsIssuanceTokenAddress, false)
      const simulatedWorkflow = await sdk.getSimulatedWorkflow({
        requestedModules,
        useTags: false,
        args,
      })

      await withoutTagsWorkflow.issuanceToken.module.write.setMinter.run([
        simulatedWorkflow.fundingManagerAddress,
        true,
      ])

      await withoutTagsWorkflow.fundingToken.module.write.approve.run([
        simulatedWorkflow.fundingManagerAddress,
        parseUnits('1000', 18),
      ])

      const result = await sdk.moduleMulticall.write({
        trustedForwarderAddress: simulatedWorkflow.trustedForwarderAddress,
        calls: [
          {
            address: simulatedWorkflow.factoryAddress,
            allowFailure: false,
            callData: simulatedWorkflow.bytecode,
          },
          {
            address: simulatedWorkflow.fundingManagerAddress,
            allowFailure: false,
            callData: await withoutTagsWorkflow.fundingManager.bytecode.buy.run(
              [parseUnits('1000', 18), parseUnits('1', 18)]
            ),
          },
          {
            address: simulatedWorkflow.fundingManagerAddress,
            allowFailure: false,
            callData:
              await withoutTagsWorkflow.fundingManager.bytecode.calculatePurchaseReturn.run(
                [parseUnits('1000', 18)]
              ),
          },
        ],
      })

      expect(result.returnDatas[0]).toBeString()
      expect(
        typeof (await withoutTagsWorkflow.fundingManager.bytecode.calculatePurchaseReturn.decodeResult(
          result.returnDatas[2]
        ))
      ).toBe('bigint')
    }, 100000)
  })
})
