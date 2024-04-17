import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import utils from '../tools'
import getWorkflow from '../src/getWorkflow'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0x4B3a97fE6588b6E2731a4939aA633dc4A86c0636',
  })

  it('Should Log The Compiled Workflow Object', () => {
    utils.writeLog({
      content: workflow,
      label: 'WorkflowObject',
      format: 'json',
    })

    expect(workflow).toBeObject()
  })
})
