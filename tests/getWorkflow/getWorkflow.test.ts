import { expect, describe, it } from 'bun:test'

import getWorkflow from '../../src/getWorkflow'
import { getTestConnectors } from '../getTestConnectors'
import writeLog from '../../tools/writeLog'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0x8a1897E6Fa0236F68f86240C391D2a7bED3Cf85c',
    workflowOrientation: {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      logicModules: ['LM_PC_Bounties_v1'],
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