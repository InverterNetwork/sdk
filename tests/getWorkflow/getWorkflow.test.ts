import { expect, describe, it } from 'bun:test'

import getWorkflow from '../../src/getWorkflow'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import writeLog from '../../tools/writeLog'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xAEbC314A26718ce8E866c8a89265d2a87dAFEcC1',
    workflowOrientation: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    },
  })

  it('Get Workflow', () => {
    writeLog({
      content: { workflow },
      label: 'workflow',
    })

    expect(workflow).toBeDefined()
  })

  it('Read Funding Manager Total Supply', async () => {
    const totalSupply = await workflow.fundingManager.read.totalSupply.run()
    writeLog({
      content: { totalSupply },
      label: 'totalSupply',
    })

    expect(totalSupply).toBeDefined()
  })

  it(
    'Write: Approve 100 IUSD',
    async () => {
      const approve = await workflow.fundingManager.write.approve.run([
        walletClient.account.address,
        '100',
      ])

      console.log('TX HASH: ', approve.hash)

      const receipt = await approve.waitForTransactionReceipt()

      expect(approve.hash).toBeString()
      expect(receipt.status).toEqual('success')
    },
    {
      timeout: 10_000,
    }
  )
})
