import {
  toCompactNumber,
  type GetModuleReturnType,
  type PopWalletClient,
  type RequestedModules,
  type Workflow,
} from '@/index'
import { beforeEach, describe, expect, it } from 'bun:test'
import chalk from 'chalk'
import {
  sdk,
  TEST_BANCOR_FORMULA_ADDRESS,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'

describe('#CURVE_SIM', () => {
  const deployer = sdk.walletClient.account.address

  const maxSupply = '1000000000' // 1 Billion
  const maxSupplyCollateral = '100000' // 100 Thousand

  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules

  let workflow: Workflow<typeof requestedModules, PopWalletClient>
  let fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>

  beforeEach(async () => {
    const { contractAddress: issuanceTokenAddress } = await sdk.deploy.write({
      name: 'ERC20Issuance_v1',
      args: {
        symbol: 'TEST',
        name: 'Test Token',
        decimals: 18,
        maxSupply,
      },
    })

    if (!issuanceTokenAddress) {
      throw new Error('Issuance token address is undefined')
    }

    const { run } = await sdk.deployWorkflow({
      requestedModules,
    })

    const { orchestratorAddress } = await run({
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        bondingCurveParams: {
          buyFee: '100',
          sellFee: '100',
          formula: TEST_BANCOR_FORMULA_ADDRESS,
          reserveRatioForBuying: 333_333,
          reserveRatioForSelling: 333_333,
          initialIssuanceSupply: String(Number(maxSupply) / 10),
          initialCollateralSupply: '760',
          buyIsOpen: true,
          sellIsOpen: true,
        },
        collateralToken: TEST_ERC20_MOCK_ADDRESS,
        issuanceToken: issuanceTokenAddress,
      },
    })

    if (!orchestratorAddress) {
      throw new Error('Orchestrator address is undefined')
    }

    workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
    })

    fundingToken = sdk.getModule({
      address: workflow.fundingToken.address,
      name: 'ERC20Issuance_v1',
      tagConfig: {
        decimals: 18,
      },
    })

    await workflow.issuanceToken.module.write.setMinter.run([
      workflow.fundingManager.address,
      true,
    ])
  })

  it(`1. Should buy from the bonding curve with maxSupplyCollateral: ${chalk.green(toCompactNumber(maxSupplyCollateral))} collateral tokens`, async () => {
    const purchaseAmount = maxSupplyCollateral

    await fundingToken.write.mint.run([deployer, purchaseAmount])

    const purchaseReturn =
      await workflow.fundingManager.read.calculatePurchaseReturn.run(
        purchaseAmount
      )

    console.log(chalk.green('purchaseReturn'), toCompactNumber(purchaseReturn))

    expect(Number(purchaseReturn)).toBeGreaterThan(0)

    await fundingToken.write.approve.run([
      workflow.fundingManager.address,
      purchaseReturn,
    ])
    const hash = await workflow.fundingManager.write.buy.run([
      purchaseAmount,
      purchaseReturn,
    ])

    expect(hash).toBeDefined()

    const balance =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    console.log(chalk.green('balance'), toCompactNumber(balance))

    const virtualIssuanceSupply =
      await workflow.fundingManager.read.getVirtualIssuanceSupply.run()

    console.log(
      chalk.green('graduationIssuanceSupply'),
      toCompactNumber(Number(virtualIssuanceSupply))
    )

    expect(Number(balance)).toBeGreaterThan(0)
  })
})
