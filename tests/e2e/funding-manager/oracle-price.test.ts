import type {
  GetDeployWorkflowArgs,
  PopWalletClient,
  RequestedModules,
  Workflow,
} from '@/index'
import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import {
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'

describe('#ORACLE_PRICE', () => {
  // CONSTANTS
  // --------------------------------------------------
  const deployer = sdk.walletClient.account.address

  const MINT_AMOUNT = '1000'

  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_PC_Oracle_Redeeming_v1',
    paymentProcessor: 'PP_Queue_ManualExecution_v1',
    optionalModules: ['LM_Oracle_Permissioned_v1'],
  } as const satisfies RequestedModules

  const args = (issuanceToken: `0x${string}`) =>
    ({
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        buyFee: '0',
        sellFee: '0',
        maxSellFee: '1000',
        maxBuyFee: '1000',
        isDirectOperationsOnly: false,
        projectTreasury: deployer,
        issuanceToken,
        collateralToken: TEST_ERC20_MOCK_ADDRESS,
      },
      paymentProcessor: {
        canceledOrdersTreasury: deployer,
        failedOrdersTreasury: deployer,
      },
      optionalModules: {
        LM_Oracle_Permissioned_v1: {
          collateralToken: TEST_ERC20_MOCK_ADDRESS,
        },
      },
    }) as const satisfies GetDeployWorkflowArgs<typeof requestedModules>

  // VARIABLES
  // --------------------------------------------------

  let workflow: Workflow<
    typeof requestedModules,
    PopWalletClient,
    'ERC20Issuance_v1',
    'ERC20Issuance_v1'
  >

  beforeAll(async () => {
    // Mint funding tokens
    // ------------------------------------------------------------
    const fundingToken = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: TEST_ERC20_MOCK_ADDRESS,
      tagConfig: {
        decimals: 18,
      },
    })

    await fundingToken.write.mint.run([deployer, MINT_AMOUNT])
  })

  beforeEach(async () => {
    const { contractAddress: issuanceTokenAddress } = await sdk.deploy.write({
      name: 'ERC20Issuance_v1',
      args: {
        name: 'My Token',
        symbol: 'MT',
        decimals: 18,
        maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
      },
    })

    const { run } = await sdk.deployWorkflow({ requestedModules })

    const { orchestratorAddress } = await run(args(issuanceTokenAddress))

    workflow = await sdk.getWorkflow({
      requestedModules,
      orchestratorAddress,
      fundingTokenType: 'ERC20Issuance_v1',
      issuanceTokenType: 'ERC20Issuance_v1',
    })

    await workflow.issuanceToken!.module.write.setMinter.run([
      workflow.fundingManager.address,
      true,
    ])

    // Step: Grant price setter role to setup script deployer
    // ------------------------------------------------------------

    const priceSetterRole =
      await workflow.optionalModule.LM_Oracle_Permissioned_v1.read.getPriceSetterRole.run()

    await workflow.optionalModule.LM_Oracle_Permissioned_v1.write.grantModuleRole.run(
      [priceSetterRole, deployer]
    )

    // Step: Set NAV price
    // ------------------------------------------------------------

    await workflow.optionalModule.LM_Oracle_Permissioned_v1.write.setIssuanceAndRedemptionPrice.run(
      ['1', '1']
    )

    // Upen buy

    await workflow.fundingManager.write.openBuy.run()

    // Set oracle address
    // ------------------------------------------------------------

    await workflow.fundingManager.write.setOracleAddress.run(
      workflow.optionalModule.LM_Oracle_Permissioned_v1.address
    )

    // Whitelist deployer
    // ------------------------------------------------------------

    const whitelistRole =
      await workflow.fundingManager.read.getWhitelistRole.run()

    await workflow.fundingManager.write.grantModuleRole.run([
      whitelistRole,
      deployer,
    ])
  })

  it(`1. Should buy issuance tokens`, async () => {
    const buyAmount = '100'

    const purchaseReturn =
      await workflow.fundingManager.read.calculatePurchaseReturn.run(buyAmount)

    const fundingTokenBalance =
      await workflow.fundingToken!.module.read.balanceOf.run(deployer)

    console.log('fundingTokenBalance', fundingTokenBalance)

    const buyHash = await workflow.fundingManager.write.buy.run([
      buyAmount,
      purchaseReturn,
    ])

    expect(buyHash).toStartWith('0x')
  })

  it(`2. Should sell tokens`, async () => {
    const sellAmount = '100'

    const sellReturn =
      await workflow.fundingManager.read.calculateSaleReturn.run(sellAmount)

    const getIssuanceTokenResponse =
      await workflow.fundingManager.read.getIssuanceToken.run()
    console.log('getIssuanceTokenResponse', getIssuanceTokenResponse)
    console.log('issuanceTokenAddress', getIssuanceTokenResponse)
    console.log('fundingTokenAddress', workflow.fundingToken?.address)

    const sellHash = await workflow.fundingManager.write.sell.run([
      sellAmount,
      sellReturn,
    ])

    expect(sellHash).toStartWith('0x')
  })
})
