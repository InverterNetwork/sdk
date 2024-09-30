import { expect, describe, it } from 'bun:test'

import {
  GET_ORCHESTRATOR_ARGS,
  sdk,
  TEST_ERC20_MOCK_ADDRESS,
} from 'tests/helpers'
import {
  ERC20_MINTABLE_ABI,
  type GetUserArgs,
  type RequestedModules,
  type Workflow,
} from '@'
import { getContract, parseUnits } from 'viem'

describe('#RUN_OPTIONS', () => {
  const deployer = sdk.walletClient.account.address

  const requestedModules = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_DepositVault_v1',
    paymentProcessor: 'PP_Streaming_v1',
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

  describe('#DEPLOY', () => {
    it('1. Should Confirm onApprove, onHash, onConfirmation callbacks return correct data', async () => {
      const { run } = await sdk.getDeploy({
        requestedModules,
      })

      await run(args, {
        confirmations: 1,
        onHash: (hash) => {
          expect(hash).toContain('0x')
        },
        onConfirmation: (receipt) => {
          expect(receipt.status).toEqual('success')
        },
        onApprove: (receipts) => {
          expect(receipts[0].status).toEqual('success')
        },
      })
    })
  })

  describe('#MODULE', () => {
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

    it('3. Should Mint 1000 Tokens', async () => {
      const tokenContract = getContract({
        address: workflow.fundingToken.address,
        abi: ERC20_MINTABLE_ABI,
        client: sdk.walletClient,
      })

      const hash = await tokenContract.write.mint([
        deployer,
        parseUnits('1000', 18),
      ])

      expect(hash).toContain('0x')
    })

    it('4. Should Confirm onApprove, onHash, onConfirmation callbacks return correct data', async () => {
      await workflow.fundingManager.write.deposit.run('1000', {
        confirmations: 1,
        onHash: (hash) => {
          expect(hash).toContain('0x')
        },
        onConfirmation: (receipt) => {
          expect(receipt.status).toEqual('success')
        },
        onApprove: (receipts) => {
          expect(receipts[0].status).toEqual('success')
        },
      })
    })
  })
})
