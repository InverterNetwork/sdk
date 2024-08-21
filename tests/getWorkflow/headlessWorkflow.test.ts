import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import utils from '../../tools'
import getWorkflow from '../../src/getWorkflow'

describe('#headlessWorkflow', async () => {
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

  it('Should Have The Funding Token', () => {
    expect(workflow.fundingToken).toBeObject()
  })

  it('Should possibly have the issuanceToken', () => {
    if (workflow.issuanceToken !== undefined) {
      expect(workflow.issuanceToken).toBeObject()
    } else {
      expect(workflow.issuanceToken).toBeUndefined()
    }
  })
})
