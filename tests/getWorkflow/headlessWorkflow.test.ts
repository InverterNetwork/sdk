import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import utils from '../../tools'
import getWorkflow from '../../src/getWorkflow'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xBc986B80A3c6b274CEd09db5A3b0Ac76a4046968',
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
