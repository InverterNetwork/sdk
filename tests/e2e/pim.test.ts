import { expect, describe, it, beforeEach } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import {
  deployedBcOrchestrator,
  getDeployArgs,
  iUSD,
} from '../testHelpers/getTestArgs'
import { ERC20_MINTABLE_ABI } from '../../src'
import { isAddress, parseUnits } from 'viem'
import { getModuleSchema } from '../../src/getDeploy/getInputs'

describe('#defaultPIM', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const

  const deployArgs = getDeployArgs(requestedModules, deployer)

  const sdk = new Inverter({ publicClient, walletClient })

  let orchestrator = deployedBcOrchestrator
  let issuanceToken: `0x${string}`
  let workflow: any

  const { estimateGas, run, inputs } = await sdk.getDeploy({ requestedModules })

  it('match expected inputs', () => {
    expect(inputs).toEqual({
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      authorizer: getModuleSchema('AUT_Roles_v1'),
      fundingManager: getModuleSchema(
        'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1'
      ),
      paymentProcessor: getModuleSchema('PP_Simple_v1'),
    })
  })

  it(
    'estimates gas for deployment',
    async () => {
      const gasEstimate = await estimateGas(deployArgs)
      expect(gasEstimate).toContainKeys(['value', 'formatted'])
    },
    {
      timeout: 50_000,
    }
  )

  describe('deploying an issuance token', () => {
    it('returns the issuance token address', async () => {
      const data = await sdk.deploy('ERC20Issuance', {
        name: 'My Token',
        symbol: 'MT',
        decimals: 18,
        maxSupply: '1000000',
        initialAdmin: walletClient.account.address,
      })

      issuanceToken = data.tokenAddress as `0x${string}`
      expect(isAddress(issuanceToken)).toBeTrue
    })
  })

  describe('deploying the BC', () => {
    it(
      'returns the orchestrator address',
      async () => {
        const { orchestratorAddress, transactionHash } = await run({
          ...deployArgs,
          fundingManager: { ...deployArgs.fundingManager, issuanceToken },
        })

        await publicClient.waitForTransactionReceipt({
          hash: transactionHash,
        })

        orchestrator = orchestratorAddress as typeof orchestrator

        expect(isAddress(orchestrator)).toBeTrue
      },
      {
        timeout: 50_000,
      }
    )
  })

  describe('assigning permissions to buy from curve', () => {
    it(
      'grants bc access role to deployer',
      async () => {
        // Get and set Workflow
        workflow = await sdk.getWorkflow({
          orchestratorAddress: orchestrator,
          requestedModules,
        })
        // Get Role
        const role =
          await workflow.fundingManager.read.CURVE_INTERACTION_ROLE.run()
        // Generate Module Role
        const generatedRole = await workflow.authorizer.read.generateRoleId.run(
          [workflow.fundingManager.address, role]
        )
        // Grant Module Role
        const grantModuleTx =
          await workflow.fundingManager.write.grantModuleRole.run([
            role,
            deployer,
          ])
        // Wait for Transaction Receipt
        await publicClient.waitForTransactionReceipt({
          hash: grantModuleTx,
        })

        const hasRole = await workflow.authorizer.read.checkForRole.run([
          generatedRole,
          deployer,
        ])

        // Expect hasRole to be true
        expect(hasRole).toBeTrue()
      },
      {
        timeout: 50_000,
      }
    )
  })

  describe('buying from the curve', () => {
    const depositAmount = '500'
    const eighteenDecimals = '000000000000000000'
    const { initialCollateralSupply } =
      deployArgs.fundingManager.bondingCurveParams

    beforeEach(async () => {
      // mint initial collateral supply to BC
      const mintTx = <`0x${string}`>await walletClient.writeContract({
        address: iUSD,
        abi: ERC20_MINTABLE_ABI,
        functionName: 'mint',
        args: [
          workflow.fundingManager.address,
          parseUnits(initialCollateralSupply, 18),
        ],
      })
      await publicClient.waitForTransactionReceipt({
        hash: mintTx,
      })

      // mint buy amount to deployer
      const mintTx2 = <`0x${string}`>await walletClient.writeContract({
        address: iUSD,
        abi: ERC20_MINTABLE_ABI,
        functionName: 'mint',
        args: [deployer, BigInt(depositAmount + eighteenDecimals)],
      })
      await publicClient.waitForTransactionReceipt({
        hash: mintTx2,
      })

      // approve buy amount to BC
      const approveTx = <`0x${string}`>await walletClient.writeContract({
        address: iUSD,
        abi: ERC20_MINTABLE_ABI,
        functionName: 'approve',
        args: [
          workflow.fundingManager.address,
          BigInt(depositAmount + eighteenDecimals),
        ],
      })
      await publicClient.waitForTransactionReceipt({
        hash: approveTx,
      })

      // set minter
      const setMinterTx = <`0x${string}`>await walletClient.writeContract({
        address: issuanceToken,
        abi: [
          {
            type: 'function',
            name: 'setMinter',
            inputs: [
              {
                name: '_minter',
                type: 'address',
                internalType: 'address',
              },
              { name: '_allowed', type: 'bool', internalType: 'bool' },
            ],
            outputs: [],
            stateMutability: 'nonpayable',
          },
        ],
        functionName: 'setMinter',
        args: [workflow.fundingManager.address, true],
      })
      await publicClient.waitForTransactionReceipt({
        hash: setMinterTx,
      })
    })

    it(
      'deposits collateral tokens into the curve',
      async () => {
        // Calculate amount out
        const amountOut =
          await workflow.fundingManager.read.calculatePurchaseReturn.run(
            depositAmount
          )
        // Buy tokens
        const buyTx = await workflow.fundingManager.write.buy.run([
          depositAmount,
          amountOut,
        ])
        // Wait for Transaction Receipt
        const { status } = await publicClient.waitForTransactionReceipt({
          hash: buyTx,
        })
        expect(status).toBe('success')
      },
      {
        timeout: 50_000,
      }
    )
  })
})
