import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { getDeployArgs, iUSD } from '../testHelpers/getTestArgs'
import { ERC20_ABI, type RequestedModules } from '../../src'

describe('#PIM_FACTORY', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules<'restricted-pim'>

  const deployArgs = {
    ...getDeployArgs(requestedModules, deployer),
    issuanceToken: {
      name: 'MG Token',
      symbol: 'MGT',
      decimals: '18',
      maxSupply:
        '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
    },
  }

  const sdk = new Inverter(publicClient, walletClient)

  const { estimateGas, run } = await sdk.getDeploy(
    requestedModules,
    'restricted-pim'
  )

  let orchestrator: `0x${string}`

  it(
    '1. Estimates gas for deployment',
    async () => {
      const gasEstimate = await estimateGas(deployArgs)
      expect(gasEstimate).toContainKeys(['value', 'formatted'])
    },
    {
      timeout: 50_000,
    }
  )

  it(
    'deploys the BC',
    async () => {
      const { orchestratorAddress, transactionHash } = await run(deployArgs)
      await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      })
      // TODO: change after PimFactory has been adapted to only return orchestrator address
      orchestrator = orchestratorAddress[0]

      console.log('Orchestrator Address:', orchestrator)
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
        address: iUSD,
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
        address: iUSD,
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
        address: iUSD,
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
