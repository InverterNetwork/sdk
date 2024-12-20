import { expect, describe, it } from 'bun:test'

import {
  FM_BC_Bancor_VirtualSupply_v1_ARGS,
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'
import type { GetUserArgs, RequestedModules, Workflow } from '@'
import { decodeEventLog, parseAbiItem } from 'viem'

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
      fundingManager: 'FM_DepositVault_v1',
      paymentProcessor: 'PP_Streaming_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    } as const satisfies RequestedModules

    const args = {
      authorizer: {
        initialAdmin: deployer,
      },
      fundingManager: {
        orchestratorTokenAddress: TEST_ERC20_MOCK_ADDRESS,
      },
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
    let claimId: string

    let orchestratorAddress: `0x${string}`
    let workflow: Workflow<typeof sdk.walletClient, typeof requestedModules>

    it('1. Should Deploy The Workflow and Mint The Orchestrator Token', async () => {
      const testToken = sdk.getModule({
        address: TEST_ERC20_MOCK_ADDRESS,
        name: 'ERC20Issuance_v1',
        extras: {
          decimals: 18,
        },
      })

      const mintHash = await testToken.write.mint.run([
        sdk.walletClient.account.address,
        '10000',
      ])

      orchestratorAddress = (
        await (
          await sdk.getDeploy({
            requestedModules,
          })
        ).run(args)
      ).orchestratorAddress

      expect(mintHash).toBeString()
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

    it('4. Should Grant Permission To Add Bounty, Add Claim, Verify Claim', async () => {
      const issuerRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.BOUNTY_ISSUER_ROLE.run()

      const issuerTxHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [issuerRole, sdk.walletClient.account.address]
        )

      const claimRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.CLAIMANT_ROLE.run()

      const claimTxHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [claimRole, sdk.walletClient.account.address]
        )

      const verifyRole =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.VERIFIER_ROLE.run()

      const verifyTxHash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.grantModuleRole.run(
          [verifyRole, sdk.walletClient.account.address]
        )

      expect(issuerTxHash).toBeString()
      expect(claimTxHash).toBeString()
      expect(verifyTxHash).toBeString()
    })

    it('5. Should Add A Bounty', async () => {
      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.addBounty.run(
          bountyArgs,
          {
            confirmations: 1,
            onConfirmation: (receipt) => {
              // Define the ABI for the BountyAdded event
              const addBountyOutputAbi = parseAbiItem(
                'event BountyAdded(uint256 indexed bountyId, uint256 minimumPayoutAmount, uint256 maximumPayoutAmount, bytes details)'
              )

              // Decode the logs using the ABI
              const decodedLogs = decodeEventLog({
                abi: [addBountyOutputAbi],
                data: receipt.logs[0].data,
                topics: receipt.logs[0].topics,
              })

              // Retrieve the bountyId from the decoded logs
              bountyId = decodedLogs.args.bountyId.toString()
            },
          }
        )

      expect(bountyId.length).toBeGreaterThan(0)
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
      expect(bountyArgs[2].message).toEqual(bounty.details.message)
    })

    it('7. Should Add A Claim', async () => {
      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.addClaim.run(
          [
            bountyId,
            [{ addr: sdk.walletClient.account.address, claimAmount: '100' }],
            {
              claimUrl: 'https://www.google.com',
            },
          ],
          {
            confirmations: 1,
            onConfirmation: (receipt) => {
              const claimAddedAbi = parseAbiItem(
                'event ClaimAdded(uint256 indexed claimId,uint256 indexed bountyId,(address,uint256)[] contributors,bytes details)'
              )

              const decodedLogs = decodeEventLog({
                abi: [claimAddedAbi],
                data: receipt.logs[0].data,
                topics: receipt.logs[0].topics,
              })

              claimId = decodedLogs.args.claimId.toString()
            },
          }
        )

      expect(claimId.length).toBeGreaterThan(0)
      expect(hash).toBeString()
    })

    let contributors: readonly {
      addr: `0x${string}`
      claimAmount: string
    }[]

    it('8. Should Read The Claim', async () => {
      const claimInformation =
        await workflow.optionalModule.LM_PC_Bounties_v1.read.getClaimInformation.run(
          claimId
        )

      contributors = claimInformation.contributors

      expect(claimInformation.bountyId).toEqual(bountyId)
    })

    it('9. Should Deposit To The Deposit Vault', async () => {
      const hash = await workflow.fundingManager.write.deposit.run('1000')

      expect(hash).toBeString()
    })

    it('10. Should Verify The Claim', async () => {
      const hash =
        await workflow.optionalModule.LM_PC_Bounties_v1.write.verifyClaim.run([
          claimId,
          contributors,
        ])

      expect(hash).toBeString()
    })
  })
})
