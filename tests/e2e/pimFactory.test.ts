import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { getDeployArgs, iUSD } from '../testHelpers/getTestArgs'
import { ERC20_ABI, ERC20_MINTABLE_ABI, type RequestedModules } from '../../src'
import { isHex, parseUnits } from 'viem'

describe('#restrictedPIM', async () => {
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

  const sdk = new Inverter({ publicClient, walletClient })

  const { estimateGas, run } = await sdk.getDeploy({
    requestedModules,
    factoryType: 'restricted-pim',
  })

  let orchestrator: `0x${string}`

  it.skip(
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
    'lets admin buy from curve',
    async () => {
      const depositAmount = '500'

      // Get and set Workflow
      const workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestrator,
        requestedModules,
      })
      // Mint tokens
      const mintTx = <`0x${string}`>await walletClient.writeContract({
        address: iUSD,
        abi: ERC20_MINTABLE_ABI,
        functionName: 'mint',
        args: [deployer, parseUnits(depositAmount, 18)],
      })
      await publicClient.waitForTransactionReceipt({
        hash: mintTx,
      })

      // approve tokens
      const approveTx = <`0x${string}`>await walletClient.writeContract({
        address: iUSD,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [workflow.fundingManager.address, parseUnits(depositAmount, 18)],
      })
      await publicClient.waitForTransactionReceipt({
        hash: approveTx,
      })

      // enable buying
      const openBuyTx = await workflow.fundingManager.write.openBuy.run()
      await publicClient.waitForTransactionReceipt({
        hash: openBuyTx,
      })
      // get expectedamount out
      const amountOut =
        await workflow.fundingManager.read.calculatePurchaseReturn.run(
          depositAmount
        )

      const buyTx = await workflow.fundingManager.write.buy.run([
        depositAmount,
        amountOut,
      ])

      expect(isHex(buyTx)).toBeTrue()
    },
    {
      timeout: 50_000,
    }
  )
})
