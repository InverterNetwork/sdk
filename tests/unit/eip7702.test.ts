import type { MixedRequestedModules, PopWalletClient, Workflow } from '@/index'
import { beforeEach, describe, expect, it } from 'bun:test'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
} from 'tests/helpers'

describe.skip('#EIP7702_Batch_Transactions', () => {
  // CONSTANTS
  // --------------------------------------------------
  const deployer = sdk.walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Simple_v1',
    authorizer: 'AUT_Roles_v1',
  } as const satisfies MixedRequestedModules

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

  const PURCHASE_AMOUNT = '1000'
  const MOCK_PURCHASE_RETURN = '1'

  // VARIABLES
  // --------------------------------------------------
  let workflow: Workflow<
    typeof requestedModules,
    PopWalletClient,
    'ERC20Issuance_v1',
    'ERC20Issuance_v1'
  >

  beforeEach(async () => {
    const issuanceTokenAddress = (
      await sdk.deploy.write({
        name: 'ERC20Issuance_v1',
        args: {
          decimals: 18,
          maxSupply: '1000000000000000000000000',
          name: 'Test Token',
          symbol: 'TEST',
        },
      })
    ).contractAddress

    const { orchestratorAddress } = await (
      await sdk.deployWorkflow({ requestedModules })
    ).run(args(issuanceTokenAddress))

    workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
      fundingTokenType: 'ERC20Issuance_v1',
      issuanceTokenType: 'ERC20Issuance_v1',
    })

    await workflow.fundingToken.module.write.mint.run([
      deployer,
      PURCHASE_AMOUNT,
    ])

    await workflow.issuanceToken.module.write.setMinter.run([deployer, true])
  })

  it(`1. Do a simple batch tx using eip7702`, async () => {
    // Approve the funding manager to spend tokens
    await workflow.fundingToken.module.write.approve.run([
      workflow.fundingManager.address,
      PURCHASE_AMOUNT,
    ])

    // Sign authorization for EIP-7702
    const authorization = await sdk.walletClient.signAuthorization({
      contractAddress: workflow.fundingManager.address,
      executor: 'self',
    })

    console.log('AUTHORIZATION PASSED')

    // Assuming your multi-call implementation has a method that accepts multiple function calls
    // This could be built into the SDK or a separate contract
    const batchTxHash = await sdk.walletClient.writeContract({
      abi: [
        {
          name: 'multicall',
          type: 'function',
          stateMutability: 'payable',
          inputs: [
            {
              name: 'calls',
              type: 'bytes[]',
            },
          ],
          outputs: [
            {
              name: 'results',
              type: 'bytes[]',
            },
          ],
        },
      ],
      address: deployer, // The EOA address which will be designated with the multi-call contract
      authorizationList: [authorization],
      functionName: 'multicall',
      args: [
        [
          // First buy operation encoded
          await workflow.fundingManager.bytecode.buy.run([
            String(Number(PURCHASE_AMOUNT) / 2),
            MOCK_PURCHASE_RETURN,
          ]),
          // Second buy operation encoded
          await workflow.fundingManager.bytecode.buy.run([
            String(Number(PURCHASE_AMOUNT) / 2),
            MOCK_PURCHASE_RETURN,
          ]),
        ],
      ],
    })

    expect(batchTxHash).toBeDefined()

    // Verify issuance token balance after the batch transaction
    const balanceAfter =
      await workflow.issuanceToken.module.read.balanceOf.run(deployer)

    expect(balanceAfter).toBeGreaterThan(0)
  })
})
