import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import utils from '../tools'
import getWorkflow from '../src/getWorkflow'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0x8a1897E6Fa0236F68f86240C391D2a7bED3Cf85c',
  })

  it('Should Log The Compiled Workflow Object', () => {
    utils.writeLog({
      content: workflow,
      label: 'headlessWorkflow',
      format: 'json',
    })

    expect(workflow).toBeObject()
  })
})
