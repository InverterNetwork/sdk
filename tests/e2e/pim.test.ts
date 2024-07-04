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

  let orchestrator: any

  describe('deployment', () => {
    it('deploys the BC', async () => {
      const { run } = await sdk.getDeploy(requestedModules)
      const { orchestratorAddress, transactionHash } = await run(deployArgs)
      await publicClient.waitForTransactionReceipt({ hash: transactionHash })
      orchestrator = orchestratorAddress
    })
  })

  describe('permissioning', () => {
    it('assigns permission to buy from curve', async () => {
      const workflow = await sdk.getWorkflow(orchestrator, requestedModules)
      const role =
        await workflow.fundingManager.read.CURVE_INTERACTION_ROLE.run()
      const grantModuleTx =
        await workflow.fundingManager.write.grantModuleRole.run([
          role,
          deployer,
        ])
      await publicClient.waitForTransactionReceipt({ hash: grantModuleTx })
      const hasRole = await workflow.authorizer.read.hasModuleRole.run([
        role,
        deployer,
      ])
      expect(hasRole).toBeTrue
    })
  })

  describe('buying', () => {
    const depositAmount = '500'
    const eighteenDecimals = '000000000000000000'

    it('deposits collateral tokens into the curve', async () => {
      const mintTx = <`0x${string}`>await walletClient.writeContract({
        address: testToken,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [deployer, BigInt(depositAmount + eighteenDecimals)],
      })
      await publicClient.waitForTransactionReceipt({ hash: mintTx })
      const workflow = await sdk.getWorkflow(orchestrator, requestedModules)
      const amountOut =
        await workflow.fundingManager.read.calculatePurchaseReturn.run(
          depositAmount
        )
      const balanceBefore = <bigint>await publicClient.readContract({
        address: testToken,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [deployer],
      })
      const buyTx = await workflow.fundingManager.write.buy.run([
        depositAmount,
        amountOut,
      ])
      await publicClient.waitForTransactionReceipt({ hash: buyTx })
      const balanceAfter = <bigint>await publicClient.readContract({
        address: testToken,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [deployer],
      })
      expect((balanceBefore - balanceAfter).toString()).toEqual(
        depositAmount + eighteenDecimals
      )
    })
  })
})
