import { expect, describe, it } from 'bun:test'
import { GET_HUMAN_READABLE_UINT_MAX_SUPPLY } from '@/index'
import type {
  RequestedModules,
  SingleModuleCall,
  ModuleMulticallCall,
} from '@/types'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TRUSTED_FORWARDER_ADDRESS,
  // TRUSTED_FORWARDER_ADDRESS,
} from 'tests/helpers'
import {
  setupWorkflowWithToken,
  type SetupWorkflowWithTokenReturnType,
} from 'tests/helpers/setup-workflow'

const MINT_AMOUNT = '10000'
// const PURCHASE_AMOUNT = String(Number(MINT_AMOUNT) / 2)

describe('#MULTICALL', () => {
  const deployer = sdk.walletClient.account.address

  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
    paymentProcessor: 'PP_Streaming_v1',
  } as const satisfies RequestedModules

  let workflowBytecode: SetupWorkflowWithTokenReturnType<
    typeof requestedModules,
    'ERC20Issuance_v1',
    true
  >

  // let workflow: SetupWorkflowWithTokenReturnType<
  //   typeof requestedModules,
  //   'ERC20Issuance_v1'
  // >

  const BASE_ARGS = {
    justBytecode: true,
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

  describe('#BONDING_CURVE', () => {
    it('1. Should deploy the issuance token & set the workflow bytecode', async () => {
      workflowBytecode = await setupWorkflowWithToken(BASE_ARGS)
    })
    it('2. Should set the minter as the funding manager', async () => {
      const transactionHash =
        await workflowBytecode.issuanceToken.write.setMinter.run([
          workflowBytecode.fundingManagerAddress,
          true,
        ])
      expect(transactionHash).toBeString()
    })
    it('3. Should mint MINT_AMOUNT to funding token to the deployer & approve the funding manager', async () => {
      const transactionHash =
        await workflowBytecode.fundingToken.write.mint.run([
          deployer,
          MINT_AMOUNT,
        ])
      const approveTransactionHash =
        await workflowBytecode.fundingToken.write.approve.run([
          workflowBytecode.fundingManagerAddress,
          MINT_AMOUNT,
        ])
      expect(transactionHash).toBeString()
      expect(approveTransactionHash).toBeString()
    })
    it('4. Should: open buy & open sell & make a purchase using multicall', async () => {
      const fundingManager = sdk.getModule({
        name: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
        address: workflowBytecode.fundingManagerAddress,
        tagConfig: {
          decimals: 18,
          walletAddress: deployer,
          defaultToken: workflowBytecode.fundingToken.address,
          issuanceToken: workflowBytecode.issuanceToken.address,
          issuanceTokenDecimals: 18,
        },
      })

      // Deploy Workflow
      // ------------------------------------------------------------------------
      const deployWorkflowSingleCall: SingleModuleCall = {
        address: workflowBytecode.factoryAddress,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: workflowBytecode.bytecode,
      }

      // Open buy
      // ------------------------------------------------------------------------
      const openBuySingleCall: SingleModuleCall = {
        address: workflowBytecode.fundingManagerAddress,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await fundingManager.bytecode.openBuy.run(),
      }

      // Open sell
      // ------------------------------------------------------------------------
      const openSellSingleCall: SingleModuleCall = {
        address: workflowBytecode.fundingManagerAddress,
        allowFailure: false, // Allow failures in case of authorization issues
        callData: await fundingManager.bytecode.openSell.run(),
      }

      // // Purchase
      // // ------------------------------------------------------------------------
      // const purchaseSingleCall: SingleModuleCall = {
      //   address: workflowBytecode.fundingManagerAddress,
      //   allowFailure: false, // Allow failures in case of authorization issues
      //   callData: await fundingManager.bytecode.buy.run(
      //     [PURCHASE_AMOUNT, '1'],
      //     {
      //       skipApprove: true,
      //       onApprove: async (receipts) => {
      //         console.log('Approved', receipts)
      //       },
      //     }
      //   ),
      // }
      // const failedPurchaseSingleCall: SingleModuleCall = {
      //   address: workflowBytecode.fundingManagerAddress,
      //   allowFailure: true, // Allow failures in case of authorization issues
      //   callData: await fundingManager.bytecode.buy.run(
      //     [String(Number(PURCHASE_AMOUNT) * 2), '1'],
      //     {
      //       skipApprove: true,
      //     }
      //   ),
      // }

      // Multicall
      // ------------------------------------------------------------------------
      const call: ModuleMulticallCall = [
        deployWorkflowSingleCall,
        openBuySingleCall,
        openSellSingleCall,
      ]

      const result = await sdk.moduleMulticall.write({
        call,
        trustedForwarderAddress: TRUSTED_FORWARDER_ADDRESS,
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
      expect(result.statuses).toEqual(['success', 'success', 'success'])
      expect(result.transactionHash).toBeString()
    })
  })
})
