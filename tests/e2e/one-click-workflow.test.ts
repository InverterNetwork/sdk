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
  const deployer = sdk.walletClient.account.address

  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Streaming_v1',
  } as const satisfies RequestedModules

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
  const issuanceTokenArgs = {
    decimals: 18,
    initialAdmin: deployer,
    name: 'Test',
    symbol: 'TEST',
    maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
  } as const

  let fundingToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
  let issuanceToken: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
  let issuanceTokenBytecode: DeployBytecodeReturnType
  let simulatedWorkflow: GetSimulatedWorkflowReturnType<DeployBytecodeReturnType>

  beforeAll(async () => {
    // Deploy the issuance token
    issuanceTokenBytecode = await sdk.deploy.bytecode({
      name: 'ERC20Issuance_v1',
      args: issuanceTokenArgs,
    })

    fundingToken = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: TEST_ERC20_MOCK_ADDRESS,
      tagConfig: {
        decimals: 18,
      },
    })

    issuanceToken = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: issuanceTokenBytecode.contractAddress,
      tagConfig: {
        decimals: 18,
      },
    })
  })

  it('should simulate the multicall workflow', async () => {
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
  })

  const PURCHASE_AMOUNT = '1000'
  let fundingManager: GetModuleReturnType<
    'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    PopWalletClient
  >
  let purchaseReturn: string

  it('should re-simulate the workflow, and this time it should also calculate purchase return from the funding manager', async () => {
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
      call: [
        {
          address: simulatedWorkflow.factoryAddress,
          allowFailure: false,
          callData: await simulatedWorkflow.tokenBytecode.run(),
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

  it('should deploy the workflow and make a purchase in batch', async () => {
    // 1. Mint collateral token to the deployer
    await fundingToken.write.mint.run([deployer, PURCHASE_AMOUNT])

    // 2. Prepare setMinter call data
    const setMinterCallData = await issuanceToken.bytecode.setMinter.run([
      fundingManager.address,
      true,
    ])

    // 3. Make deploy and purchase in batch
    await sdk.moduleMulticall.write({
      trustedForwarderAddress: simulatedWorkflow.trustedForwarderAddress,
      call: [
        {
          address: simulatedWorkflow.factoryAddress,
          allowFailure: false,
          callData: await simulatedWorkflow.tokenBytecode.run([
            setMinterCallData,
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
          allowFailure: true,
          callData: await fundingManager.bytecode.buy.run([
            PURCHASE_AMOUNT,
            purchaseReturn,
          ]),
        },
      ],
    })

    const currentIssuanceTokenBalance =
      await issuanceToken.read.balanceOf.run(deployer)

    expect(Number(currentIssuanceTokenBalance)).toBeGreaterThanOrEqual(
      Number(PURCHASE_AMOUNT)
    )
  })
})
