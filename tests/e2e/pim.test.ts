import { expect, describe, it, beforeAll } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { isAddress } from 'viem'
import { GetUserArgs } from '../../src'
import { getAuthorizerArgs, getBcArgs, getDeployArgs, getOrchestratorArgs, testToken } from '../testHelpers/getTestArgs'
import { getToken } from '../testHelpers/getTestContract'



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

    let orchestrator

    describe.skip("deployment", () => {
      it("deploys the BC", async () => {
        const {run} = await sdk.getDeploy(requestedModules)
        const { orchestratorAddress, transactionHash } = await run(deployArgs)
        await publicClient.waitForTransactionReceipt({hash: transactionHash})
        orchestrator = orchestratorAddress

      })
    })

    describe.skip("permissioning", () => {
      it("assigns permission to buy from curve", async () => {
        const workflow = await sdk.getWorkflow(orchestrator, requestedModules)
        const role = await workflow.fundingManager.read.CURVE_INTERACTION_ROLE.run()
        const grantModuleTx = await workflow.fundingManager.write.grantModuleRole.run([role, deployer])
        await publicClient.waitForTransactionReceipt({hash: grantModuleTx})
        const hasRole = await workflow.authorizer.read.hasModuleRole.run([role, deployer])
        expect(hasRole).toBeTrue
      })
    })

    describe("buying", () => {
      const depositAmount = "1000"
      const eighteenDecimals = "000000000000000000"

      // beforeAll(async () => {
      //   const token = getToken(testToken, publicClient, walletClient)
      //   const mintTx = await token.write.mint([deployer, depositAmount + eighteenDecimals])
      //   await publicClient.waitForTransactionReceipt({hash: mintTx})
      // })

      it("buys tokens from the curve", async () => {
        const workflow = await sdk.getWorkflow("0x64d71b53ff66f9D12299F316DC0b8e143509a020", requestedModules)
        const buyTx = await workflow.fundingManager.write.buy.run(["10000", "1"])

        
      })
    })
  })
  