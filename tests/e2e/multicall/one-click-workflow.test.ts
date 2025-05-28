import { getFactoryAddress } from '@/index'
import type {
  DeployBytecodeReturnType,
  GetModuleReturnType,
  GetSimulatedWorkflowReturnType,
  PopWalletClient,
  RequestedModules,
} from '@/types'
import { beforeAll, describe, expect, it } from 'bun:test'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'

describe('#ONE_CLICK_WORKFLOW', () => {
  // CONSTANTS
  // --------------------------------------------------------------------------

  // The deployer is the account that will deploy the workflow
  const deployer = sdk.walletClient.account.address

  // The requested modules are the modules that will be deployed
  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Streaming_v1',
  } as const satisfies RequestedModules

  // The args are the arguments for the modules deployed in the workflow
  const args = (issuanceTokenAddress: `0x${string}`) => {
    return {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        ...FM_BC_Bancor_VirtualSupply_v1_ARGS,
        issuanceToken: issuanceTokenAddress,
      },
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const
  }

  // The issuance token args are the arguments for the issuance token
  const issuanceTokenArgs = (initialAdmin: `0x${string}`) =>
    ({
      decimals: 18,
      initialAdmin,
      name: 'Test',
      symbol: 'TEST',
      maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
    }) as const

  // The purchase amount is the amount of collateral tokens to purchase with
  const PURCHASE_AMOUNT = '1000'

  // VARIABLES
  // --------------------------------------------------------------------------
  let factoryAddress: `0x${string}`
  let issuanceTokenBytecode: DeployBytecodeReturnType
  let fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
  let issuanceToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
  let simulatedWorkflow: GetSimulatedWorkflowReturnType
  let fundingManager: GetModuleReturnType<
    'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    PopWalletClient
  >

  let purchaseReturn: string

  beforeAll(async () => {
    // Get the factory address
    factoryAddress = await getFactoryAddress({
      version: 'v1.0.0',
      chainId: sdk.publicClient.chain.id,
    })

    // Deploy the issuance token
    issuanceTokenBytecode = await sdk.deploy.bytecode({
      name: 'ERC20Issuance_v1',
      args: issuanceTokenArgs(factoryAddress),
    })

    // Set the funding token instance
    fundingToken = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: TEST_ERC20_MOCK_ADDRESS,
      tagConfig: {
        decimals: 18,
      },
    })

    // Set the issuance token instance
    issuanceToken = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: issuanceTokenBytecode.contractAddress,
      tagConfig: {
        decimals: 18,
      },
    })

    // Mint collateral token to the deployer
    await fundingToken.write.mint.run([deployer, PURCHASE_AMOUNT])
  })

  it('Should simulate the multicall workflow', async () => {
    simulatedWorkflow = await sdk.getSimulatedWorkflow({
      requestedModules,
      args: args(issuanceToken.address),
      tagConfig: {
        decimals: 18,
        issuanceTokenDecimals: 18,
      },
      tokenBytecode: issuanceTokenBytecode,
    })

    expect(simulatedWorkflow.orchestratorAddress).toBeDefined()
    expect(simulatedWorkflow.logicModuleAddresses).toBeDefined()
    expect(simulatedWorkflow.fundingManagerAddress).toBeDefined()
    expect(simulatedWorkflow.authorizerAddress).toBeDefined()
    expect(simulatedWorkflow.paymentProcessorAddress).toBeDefined()
    expect(simulatedWorkflow.trustedForwarderAddress).toBeDefined()
    expect(simulatedWorkflow.factoryAddress).toBeDefined()
  })

  it('Should re-simulate the workflow, and this time it should also calculate purchase return from the funding manager', async () => {
    fundingManager = sdk.getModule({
      name: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      address: simulatedWorkflow.fundingManagerAddress,
      tagConfig: {
        walletAddress: deployer,
        defaultToken: FM_BC_Bancor_VirtualSupply_v1_ARGS.collateralToken,
        decimals: 18,
        issuanceToken: FM_BC_Bancor_VirtualSupply_v1_ARGS.issuanceToken,
        issuanceTokenDecimals: 18,
      },
    })

    const {
      returnDatas: [, , purchaseReturnReturnData],
    } = await sdk.moduleMulticall.simulate({
      trustedForwarderAddress: simulatedWorkflow.trustedForwarderAddress,
      calls: [
        {
          address: simulatedWorkflow.factoryAddress,
          allowFailure: false,
          callData: await issuanceTokenBytecode.run(),
        },
        {
          address: simulatedWorkflow.factoryAddress,
          allowFailure: false,
          callData: simulatedWorkflow.bytecode,
        },
        {
          address: fundingManager.address,
          allowFailure: false,
          callData:
            await fundingManager.bytecode.calculatePurchaseReturn.run(
              PURCHASE_AMOUNT
            ),
        },
      ],
    })

    purchaseReturn =
      await fundingManager.bytecode.calculatePurchaseReturn.decodeResult(
        purchaseReturnReturnData
      )

    expect(Number(purchaseReturn)).toBeGreaterThanOrEqual(0)
  })

  it(
    'Should deploy the workflow with the token and make a purchase in batch',
    async () => {
      await sdk.moduleMulticall.write(
        {
          trustedForwarderAddress: simulatedWorkflow.trustedForwarderAddress,
          calls: [
            {
              address: simulatedWorkflow.factoryAddress,
              allowFailure: false,
              callData: await issuanceTokenBytecode.run([
                await issuanceToken.bytecode.setMinter.run([
                  fundingManager.address,
                  true,
                ]),
                await issuanceToken.bytecode.transferOwnership.run(deployer),
              ]),
            },
            {
              address: simulatedWorkflow.factoryAddress,
              allowFailure: false,
              callData: simulatedWorkflow.bytecode,
            },
            {
              address: fundingManager.address,
              allowFailure: false,
              callData: await fundingManager.bytecode.openBuy.run(),
            },
            {
              address: fundingManager.address,
              allowFailure: false,
              callData: await fundingManager.bytecode.buy.run([
                PURCHASE_AMOUNT,
                purchaseReturn,
              ]),
            },
          ],
        },
        {
          confirmations: 1,
        }
      )

      const currentIssuanceTokenBalance =
        await issuanceToken.read.balanceOf.run(deployer)

      expect(Number(currentIssuanceTokenBalance)).toBeGreaterThanOrEqual(
        Number(PURCHASE_AMOUNT)
      )
    },
    {
      timeout: 10000, // 10 seconds
    }
  )
})
