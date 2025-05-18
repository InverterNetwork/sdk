import { expect, describe, it, beforeAll } from 'bun:test'
import { GET_HUMAN_READABLE_UINT_MAX_SUPPLY, type Workflow } from '@/index'
import type {
  GetDeployWorkflowArgs,
  GetModuleReturnType,
  RequestedModules,
  WriteMulticall,
  SingleWriteCall,
} from '@/types'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
} from 'tests/helpers'

const MINT_AMOUNT = '10000'
const PURCHASE_AMOUNT = String(Number(MINT_AMOUNT) / 2)

describe('#MULTICALL', () => {
  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Streaming_v1',
  } as const satisfies RequestedModules

  const deployer = sdk.walletClient.account.address
  let issuanceToken: GetModuleReturnType<
    'ERC20Issuance_v1',
    typeof sdk.walletClient
  >

  let orchestratorAddress: `0x${string}`
  let workflow: Workflow<
    typeof requestedModules,
    typeof sdk.walletClient,
    'ERC20Issuance_v1'
  >

  beforeAll(async () => {
    const { contractAddress } = await sdk.deploy({
      name: 'ERC20Issuance_v1',
      args: {
        name: 'Test Issuance Token',
        symbol: 'TIT',
        decimals: 18,
        maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
        initialAdmin: deployer,
      },
    })

    if (!contractAddress) {
      throw new Error('Failed to deploy issuance token')
    }

    issuanceToken = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: contractAddress,
      tagConfig: {
        decimals: 18,
      },
    })

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        ...FM_BC_Bancor_VirtualSupply_v1_ARGS,
        issuanceToken: issuanceToken.address,
      },
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const satisfies GetDeployWorkflowArgs<typeof requestedModules>

    orchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules,
        })
      ).run(args)
    ).orchestratorAddress
  })

  describe('#BONDING_CURVE', () => {
    it('1. Should Deploy The Workflow', async () => {
      expect(orchestratorAddress).toContain('0x')
    })
    it('2. Should Get The Workflow & set minter', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestratorAddress,
        requestedModules,
        fundingTokenType: 'ERC20Issuance_v1',
      })

      const transactionHash = await issuanceToken.write.setMinter.run([
        workflow.fundingManager.address,
        true,
      ])
      expect(transactionHash).toBeString()
    })
    it('3. Should mint MINT_AMOUNT to funding token to the deployer', async () => {
      const transactionHash = await workflow.fundingToken.module.write.mint.run(
        [deployer, MINT_AMOUNT]
      )
      expect(transactionHash).toBeString()
    })
    it('4. Should: open buy & open sell & make a purchase using multicall', async () => {
      // Open buy
      // ------------------------------------------------------------------------
      const openBuySingleCall: SingleWriteCall = {
        address: workflow.fundingManager.address,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await workflow.fundingManager.bytecode.openBuy.run(),
      }

      // Open sell
      // ------------------------------------------------------------------------
      const openSellSingleCall: SingleWriteCall = {
        address: workflow.fundingManager.address,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await workflow.fundingManager.bytecode.openSell.run(),
      }

      // Purchase
      // ------------------------------------------------------------------------
      const purchaseReturn =
        await workflow.fundingManager.read.calculatePurchaseReturn.run(
          PURCHASE_AMOUNT
        )
      const purchaseSingleCall: SingleWriteCall = {
        address: workflow.fundingManager.address,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await workflow.fundingManager.bytecode.buy.run(
          [PURCHASE_AMOUNT, purchaseReturn],
          {
            skipApprove: false,
            onApprove: async (receipts) => {
              console.log('Approved', receipts)
            },
          }
        ),
      }
      const failedPurchaseSingleCall: SingleWriteCall = {
        address: workflow.fundingManager.address,
        allowFailure: true, // Allow failures in case of authorization issues
        callData: await workflow.fundingManager.bytecode.buy.run(
          [String(Number(PURCHASE_AMOUNT) * 2), '1'],
          {
            skipApprove: true,
          }
        ),
      }

      // Multicall
      // ------------------------------------------------------------------------
      const call: WriteMulticall = [
        openBuySingleCall,
        openSellSingleCall,
        purchaseSingleCall,
        failedPurchaseSingleCall,
      ]

      const result = await sdk.writeMulticall({
        call,
        orchestratorAddress,
        options: {
          onConfirmation: (receipt) => {
            console.log('MULTICALL CONFIRMATION STATUS', receipt.status)
          },
          onHash: (hash) => {
            console.log('MULTICALL TX_HASH', hash)
          },
        },
      })

      expect(result.returnDatas[0]).toBeString()
      expect(result.returnDatas[1]).toBeString()
      expect(result.returnDatas[2]).toBeString()
      expect(result.returnDatas[3]).toBeString()
      expect(result.statuses).toEqual(['success', 'success', 'success', 'fail'])
      expect(result.transactionHash).toBeString()
    })
  })
})
