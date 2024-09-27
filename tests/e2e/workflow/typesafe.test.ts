import { expect, describe, it } from 'bun:test'

import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
} from 'tests/helpers'
import type { GetUserArgs, RequestedModules, Workflow } from '@'

describe('#WORKFLOW', () => {
  const deployer = sdk.walletClient.account.address

  describe('#BONDING_CURVE', () => {
    const requestedModules = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
    } as const satisfies RequestedModules

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const satisfies GetUserArgs<typeof requestedModules>

    let orchestratorAddress: `0x${string}`
    let workflow: Workflow<typeof sdk.walletClient, typeof requestedModules>

    it('1. Should Deploy The Workflow', async () => {
      orchestratorAddress = (
        await (
          await sdk.getDeploy({
            requestedModules,
          })
        ).run(args)
      ).orchestratorAddress

      expect(orchestratorAddress).toContain('0x')
    })
    it('2. Should Get The Workflow', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestratorAddress,
        requestedModules,
      })
      expect(workflow).toBeObject()
    })
    it('3. Should Have: ( fundingToken & issuanceToken: address, module, decimals, symbol )', () => {
      expect(workflow.fundingToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])

      expect(workflow.issuanceToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])
    })
    it('4. Should Read The Static Price For Buying', async () => {
      const staticPriceForBuying =
        await workflow.fundingManager.read.getStaticPriceForBuying.run()
      expect(staticPriceForBuying).toBeString()
    })
  })

  describe('#BOUNTY_MANAGER', () => {
    const requestedModules = {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    } as const satisfies RequestedModules

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: FM_BC_Bancor_VirtualSupply_v1_ARGS,
      orchestrator: GET_ORCHESTRATOR_ARGS(deployer),
    } as const satisfies GetUserArgs<typeof requestedModules>

    const bountyArgs = [
      '100',
      '1000',
      {
        message: 'Bounty for the first person to complete the task',
      },
    ] as const
    let bountyId: string

    let orchestratorAddress: `0x${string}`
    let workflow: Workflow<typeof sdk.walletClient, typeof requestedModules>

    it('1. Should Deploy The Workflow', async () => {
      orchestratorAddress = (
        await (
          await sdk.getDeploy({
            requestedModules,
          })
        ).run(args)
      ).orchestratorAddress

      expect(orchestratorAddress).toContain('0x')
    })
    it('2. Should Get The Workflow', async () => {
      workflow = await sdk.getWorkflow({
        orchestratorAddress: orchestratorAddress,
        requestedModules,
      })
      expect(workflow).toBeObject()
    })
    it('3. Should Have: ( fundingToken: address, module, decimals, symbol )', async () => {
      expect(workflow.fundingToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])
    })
    it('4. Should Grant Permission To Add Bounty', async () => {
      const issuerRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.BOUNTY_ISSUER_ROLE.run()

      const txHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [issuerRole, sdk.walletClient.account.address]
        )

      expect(txHash).toBeString()
    })
    it('5. Should Add A Bounty', async () => {
      bountyId = (
        await workflow.optionalModule.LM_PC_Bounties_v1.simulate.addBounty.run(
          bountyArgs
        )
      ).result

      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.addBounty.run(
          bountyArgs
        )

      expect(bountyId).toBeString()
      expect(hash).toBeString()
    })
    it('6. Should Read And Match The Bounty', async () => {
      const bounty =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.getBountyInformation.run(
          bountyId
        )

      expect(bountyArgs[0]).toEqual(<any>bounty.minimumPayoutAmount)
      expect(bountyArgs[1]).toEqual(<any>bounty.maximumPayoutAmount)
      expect(bountyArgs[2]).toEqual(bounty.details)
    })
  })
})
