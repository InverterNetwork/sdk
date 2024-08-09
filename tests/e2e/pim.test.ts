import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { getDeployArgs, testToken } from '../testHelpers/getTestArgs'
import { ERC20_ABI } from '../../src'

describe('PIM', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const deployer = walletClient.account.address
  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const
  const deployArgs = getDeployArgs(requestedModules, deployer) as any

  const sdk = new Inverter(publicClient, walletClient)

  const skipDeploy = true
  let orchestrator =
    // this orchestrator belongs to mguleryuz test account
    '0xCDfC7e4a5F377816C9bA533D45F269198Ef1F910' as `0x${string}`

  it(
    'estimates gas for deployment',
    async () => {
      const { estimateGas } = await sdk.getDeploy(requestedModules)
      const gasEstimate = await estimateGas(deployArgs)
      expect(gasEstimate).toContainKeys(['value', 'formatted'])
    },
    {
      timeout: 50_000,
    }
  )

  it.skipIf(skipDeploy)(
    'deploys the BC',
    async () => {
      const { run } = await sdk.getDeploy(requestedModules)
      const { orchestratorAddress, transactionHash } = await run(deployArgs)
      await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      })
      orchestrator = orchestratorAddress
    },
    {
      timeout: 50_000,
    }
  )

  it(
    'assigns permission to buy from curve',
    async () => {
      // Get and set Workflow
      const workflow = await sdk.getWorkflow(orchestrator, requestedModules)
      // Get Role
      const role =
        await workflow.fundingManager.read.CURVE_INTERACTION_ROLE.run()
      // Generate Module Role
      const generatedRole = await workflow.authorizer.read.generateRoleId.run([
        workflow.fundingManager.address,
        role,
      ])
      // Grant Module Role
      const grantModuleTx =
        await workflow.fundingManager.write.grantModuleRole.run([
          generatedRole,
          deployer,
        ])
      // Wait for Transaction Receipt
      await publicClient.waitForTransactionReceipt({
        hash: grantModuleTx,
      })
      // Read hasRole
      const hasRole = await workflow.authorizer.read.hasRole.run([
        generatedRole,
        deployer,
      ])
      // Expect hasRole to be true
      expect(hasRole).toBeTrue
    },
    {
      timeout: 50_000,
    }
  )

  it(
    'deposits collateral tokens into the curve',
    async () => {
      const depositAmount = '500'
      const eighteenDecimals = '000000000000000000'

      // Get and set Workflow
      const workflow = await sdk.getWorkflow(orchestrator, requestedModules)
      // Mint tokens
      const mintTx = <`0x${string}`>await walletClient.writeContract({
        address: testToken,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [deployer, BigInt(depositAmount + eighteenDecimals)],
      })
      // Wait for Transaction Receipt
      await publicClient.waitForTransactionReceipt({
        hash: mintTx,
      })
      // Calculate amount out
      const amountOut =
        await workflow.fundingManager.read.calculatePurchaseReturn.run(
          depositAmount
        )
      // Read balance before
      const balanceBefore = <bigint>await publicClient.readContract({
        address: testToken,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [deployer],
      })
      // Buy tokens
      const buyTx = await workflow.fundingManager.write.buy.run([
        depositAmount,
        amountOut,
      ])
      // Wait for Transaction Receipt
      await publicClient.waitForTransactionReceipt({
        hash: buyTx,
      })
      // Read balance after
      const balanceAfter = <bigint>await publicClient.readContract({
        address: testToken,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [deployer],
      })
      // Expect balance to be less
      expect((balanceBefore - balanceAfter).toString()).toEqual(
        depositAmount + eighteenDecimals
      )
    },
    {
      timeout: 50_000,
    }
  )
})
