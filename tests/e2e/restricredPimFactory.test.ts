import { expect, describe, it, beforeAll } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import {
  getDeployArgs,
  iUSD,
  restrictedPimFactory,
} from '../testHelpers/getTestArgs'
import { ERC20_ABI, ERC20_MINTABLE_ABI, type RequestedModules } from '../../src'
import { isHex, parseUnits, getContract } from 'viem'
import { getModuleSchema } from '../../src/getDeploy/getInputs'
import { getModuleData } from '@inverter-network/abis'

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
      decimals: 18,
      maxSupply:
        '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
    },
  }

  const sdk = new Inverter({ publicClient, walletClient })

  const { estimateGas, run, inputs } = await sdk.getDeploy({
    requestedModules,
    factoryType: 'restricted-pim',
  })

  let orchestrator: `0x${string}`

  beforeAll(async () => {
    const amount = parseUnits(
      deployArgs.fundingManager.bondingCurveParams.initialCollateralSupply,
      18
    )
    const tokenInstance = getContract({
      address: iUSD,
      client: walletClient,
      abi: ERC20_MINTABLE_ABI,
    })

    // mint test tokens to deployer
    console.info(`Minting ${amount} tokens (${iUSD}) to ${deployer}...`)
    const hash1 = await tokenInstance.write.mint([deployer, amount])
    await publicClient.waitForTransactionReceipt({ hash: hash1 })
    console.info('✅ Tokens minted')

    // approving test tokens to factory
    console.info(`Approving test tokens to factory...`)
    const hash2 = await tokenInstance.write.approve([
      restrictedPimFactory,
      amount,
    ])
    await publicClient.waitForTransactionReceipt({ hash: hash2 })
    console.info('✅ Tokens minted')

    const factoryInstance = getContract({
      address: restrictedPimFactory,
      client: walletClient,
      abi: getModuleData('Restricted_PIM_Factory_v1').abi,
    })

    // add funding to factory
    console.log('Adding funding to factory...')
    const hash3 = await factoryInstance.write.addFunding([
      deployer,
      iUSD,
      amount,
    ])
    await publicClient.waitForTransactionReceipt({ hash: hash3 })
    console.log('✅ Funding added')
  })

  it('match expected inputs', () => {
    expect(inputs).toEqual({
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      authorizer: getModuleSchema('AUT_Roles_v1'),
      fundingManager: getModuleSchema(
        'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1'
      ),
      paymentProcessor: getModuleSchema('PP_Simple_v1'),
      issuanceToken: getModuleSchema(
        'Restricted_PIM_Factory_v1',
        'issuanceToken'
      ),
    })
  })

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
      orchestrator = orchestratorAddress as typeof orchestrator

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
