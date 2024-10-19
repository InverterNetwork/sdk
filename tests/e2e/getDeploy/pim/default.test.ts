import { expect, describe, it } from 'bun:test'

import { type GetUserArgs, type RequestedModules, type Workflow } from '@'
import { getModuleSchema } from '@/getDeploy/getInputs'
import { getContract, isAddress, isHash, parseUnits } from 'viem'
import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  GET_ORCHESTRATOR_ARGS,
  sdk,
} from 'tests/helpers'
import { getModuleData } from '@inverter-network/abis'

describe('#PIM_DEFAULT', async () => {
  const { walletClient } = sdk
  const deployer = walletClient.account.address

  const requestedModules = {
    fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
    authorizer: 'AUT_Roles_v1',
    paymentProcessor: 'PP_Simple_v1',
  } as const satisfies RequestedModules

  const args = {
    authorizer: {
      initialAdmin: deployer,
    },
    fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
    orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
  } as const satisfies GetUserArgs<typeof requestedModules>

  let orchestratorAddress: `0x${string}`
  let issuanceToken: `0x${string}`
  let workflow: Workflow<typeof sdk.walletClient, typeof requestedModules>

  const { estimateGas, run, inputs } = await sdk.getDeploy({ requestedModules })

  it('1. Match expected inputs', () => {
    expect(
      inputs.fundingManager.inputs.find((i) => i?.name === 'issuanceToken')
    ).toBeDefined()
    expect(inputs).toEqual({
      orchestrator: getModuleSchema('OrchestratorFactory_v1'),
      authorizer: getModuleSchema('AUT_Roles_v1'),
      fundingManager: getModuleSchema(
        'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1'
      ),
      paymentProcessor: getModuleSchema('PP_Simple_v1'),
    })
  })

  it('2. Estimates gas for deployment', async () => {
    const gasEstimate = await estimateGas(args)
    expect(gasEstimate).toContainKeys(['value', 'formatted'])
  })

  it('3. deploying an issuance token', async () => {
    const data = await sdk.deploy({
      name: 'ERC20Issuance_v1',
      args: {
        name: 'My Token',
        symbol: 'MT',
        decimals: 18,
        maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
        initialAdmin: walletClient.account.address,
      },
    })

    issuanceToken = data.contractAddress!

    expect(isAddress(issuanceToken)).toBeTrue
  })

  it('4. Deploy the Bondig Curve Workflow', async () => {
    orchestratorAddress = (
      await run({
        ...args,
        fundingManager: { ...args.fundingManager, issuanceToken },
      })
    ).orchestratorAddress

    expect(isAddress(orchestratorAddress)).toBeTrue
  })

  it('5. Assigning permissions to buy from curve', async () => {
    // Get and set Workflow
    workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
    })
    // Get Role
    const role = await workflow.fundingManager.read.CURVE_INTERACTION_ROLE.run()
    // Generate Module Role
    const generatedRole = await workflow.authorizer.read.generateRoleId.run([
      workflow.fundingManager.address,
      role,
    ])
    // Grant Module Role
    await workflow.fundingManager.write.grantModuleRole.run([role, deployer])

    const hasRole = await workflow.authorizer.read.checkForRole.run([
      generatedRole,
      deployer,
    ])

    // Expect hasRole to be true
    expect(hasRole).toBeTrue()
  })

  const depositAmount = '100'
  const { initialCollateralSupply } = args.fundingManager.bondingCurveParams

  it('6. Setup the curve', async () => {
    const fundingToken = getContract({
      address: workflow.fundingToken.address,
      abi: getModuleData('ERC20Issuance_v1').abi,
      client: {
        wallet: walletClient,
      },
    })

    // mint initial collateral supply to BC
    await fundingToken.write.mint([
      workflow.fundingManager.address,
      parseUnits(initialCollateralSupply, 18),
    ])

    // mint buy amount to deployer
    await fundingToken.write.mint([deployer, parseUnits(depositAmount, 18)])

    // approve buy amount to BC
    await workflow.fundingToken.module.write.approve.run([
      workflow.fundingManager.address,
      depositAmount,
    ])

    // set minter
    await workflow.issuanceToken.module.write.setMinter.run([
      workflow.fundingManager.address,
      true,
    ])
  })

  it('7. Buy from the curve', async () => {
    // Calculate amount out
    const amountOut =
      await workflow.fundingManager.read.calculatePurchaseReturn.run(
        depositAmount
      )

    // Buy tokens
    const hash = await workflow.fundingManager.write.buy.run([
      depositAmount,
      amountOut,
    ])

    expect(isHash(hash)).toBeTrue()
  })
})
