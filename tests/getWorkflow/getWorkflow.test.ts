import { expect, describe, it } from 'bun:test'

import getWorkflow from '../../src/getWorkflow'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import writeLog from '../../tools/writeLog'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xBc986B80A3c6b274CEd09db5A3b0Ac76a4046968',
    workflowOrientation: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      paymentProcessor: 'PP_Streaming_v1',
      optionalModules: ['LM_PC_PaymentRouter_v1'],
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
    const url = await workflow.fundingManager.read.url.run()
    writeLog({
      content: { url },
      label: 'url',
    })

    expect(url).toBeDefined()
  })
})
