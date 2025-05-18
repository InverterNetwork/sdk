import { expect, describe, it, beforeAll } from 'bun:test'
import { GET_HUMAN_READABLE_UINT_MAX_SUPPLY } from '@/index'
import type { RequestedModules, WriteMulticall, SingleWriteCall } from '@/types'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TRUSTED_FORWARDER_ADDRESS,
} from 'tests/helpers'
import {
  setupWorkflowWithToken,
  type SetupWorkflowWithTokenReturnType,
} from 'tests/helpers/setup-workflow'

const MINT_AMOUNT = '10000'
const PURCHASE_AMOUNT = String(Number(MINT_AMOUNT) / 2)

describe('#MULTICALL', () => {
  const deployer = sdk.walletClient.account.address

  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Streaming_v1',
  } as const satisfies RequestedModules

  let workflow: SetupWorkflowWithTokenReturnType<
    typeof requestedModules,
    'ERC20Issuance_v1'
  >

  const BASE_ARGS = {
    requestedModules,
    issuanceTokenName: 'ERC20Issuance_v1',
    issuanceTokenArgs: {
      name: 'Test Issuance Token',
      symbol: 'TIT',
      decimals: 18,
      maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
      initialAdmin: deployer,
    },
    workflowArgs: (issuanceTokenAddress: `0x${string}`) => ({
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        ...FM_BC_Bancor_VirtualSupply_v1_ARGS,
        issuanceToken: issuanceTokenAddress,
      },
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    }),
  } as const

  beforeAll(async () => {
    workflow = await setupWorkflowWithToken(BASE_ARGS)
  })

  describe('#BONDING_CURVE', () => {
    it('0. Should deploy a dummy workflow with just bytecode', async () => {
      const { bytecode, factoryAddress } = await setupWorkflowWithToken({
        justBytecode: true,
        ...BASE_ARGS,
      })

      expect(bytecode).toBeString()

      const { transactionHash } = await sdk.writeMulticall({
        trustedForwarderAddress: TRUSTED_FORWARDER_ADDRESS,
        call: [
          {
            address: factoryAddress,
            allowFailure: false,
            callData: bytecode,
          },
        ],
      })

      expect(transactionHash).toBeString()
    })
    it('1. Should Deploy The Workflow', async () => {
      expect(workflow.orchestrator.address).toContain('0x')
    })
    it('2. Should set the minter as the funding manager', async () => {
      const transactionHash =
        await workflow.issuanceToken.module.write.setMinter.run([
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
        orchestratorAddress: workflow.orchestrator.address,
        options: {
          onConfirmation: (receipt) => {
            console.log('MULTICALL CONFIRMATION STATUS', receipt.status)
          },
          onHash: (hash) => {
            console.log('MULTICALL TX_HASH', hash)
          },
        },
      })

      console.log('MULTICALL STATUS', result.statuses)
      console.log('MULTICALL RETURN DATA', result.returnDatas)

      expect(result.returnDatas[0]).toBeString()
      expect(result.returnDatas[1]).toBeString()
      expect(result.returnDatas[2]).toBeString()
      expect(result.returnDatas[3]).toBeString()
      expect(result.statuses).toEqual(['success', 'success', 'success', 'fail'])
      expect(result.transactionHash).toBeString()
    })
  })
})
