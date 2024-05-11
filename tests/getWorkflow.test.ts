import { expect, describe, it } from 'bun:test'

import getWorkflow from '../src/getWorkflow'
import { getTestConnectors } from './getTestConnectors'
import writeLog from '../tools/writeLog'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xa6d0De11004506381Af94e4dDc9E72D2d3EB982d',
    workflowOrientation: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      logicModule: 'LM_PC_Bounties_v1',
    },
  })

  it('Get Workflow', () => {
    writeLog({
      content: { workflow },
      label: 'workflow',
    })

    expect(workflow).toBeDefined()
  })
})
