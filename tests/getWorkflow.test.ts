import { expect, describe, it } from 'bun:test'

import getWorkflow from '../src/getWorkflow'
import { getTestConnectors } from './getTestConnectors'
import writeToFile from '../tools/utils/writeLog'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0xAC7f5C238d3BEdF5510a84dBEDB8db342E2e7320',
    workflowOrientation: {
      authorizer: {
        name: 'RoleAuthorizer',
        version: 'v1.0',
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: 'v1.0',
      },
      logicModule: {
        name: 'BountyManager',
        version: 'v1.0',
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: 'v1.0',
      },
    },
  })

  it('Should Log The Compiled Workflow Object', () => {
    const { erc20Contract, ...rest } = workflow

    writeToFile(rest, 'WorkflowObject')
    expect(workflow).pass()
  })
})
