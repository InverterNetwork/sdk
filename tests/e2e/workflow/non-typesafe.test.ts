import { expect, describe, it } from 'bun:test'

import { sdk } from 'tests/helpers'
import { TEST_ERC20_MOCK_ADDRESS } from '../../helpers/constants'

import type { Workflow } from '@/index'

describe('#WORKFLOW_NON_TYPESAFE', () => {
  let workflow: Workflow<typeof sdk.walletClient, undefined>
  let orchestratorAddress: `0x${string}`

  it('1. Should Deploy The Workflow', async () => {
    orchestratorAddress = (
      await (
        await sdk.deployWorkflow({
          requestedModules: {
            authorizer: 'AUT_Roles_v1',
            fundingManager: 'FM_DepositVault_v1',
            paymentProcessor: 'PP_Simple_v1',
          },
        })
      ).run({
        authorizer: { initialAdmin: sdk.walletClient.account.address },
        fundingManager: { orchestratorTokenAddress: TEST_ERC20_MOCK_ADDRESS },
      })
    ).orchestratorAddress

    expect(orchestratorAddress).toContain('0x')
  })

  it('2. Should Get The Workflow', async () => {
    workflow = await sdk.getWorkflow({
      orchestratorAddress: orchestratorAddress,
    })

    expect(workflow).toBeObject()
  })

  it('3. Should Match The Version Of The Funding Manager', async () => {
    const version = await workflow.fundingManager.read.version.run()

    expect(version).toEqual(['1', '0', '0'])
  })
})
