import { expect, describe, it } from 'bun:test'

import getWorkflow from '../src/getWorkflow'
import { getTestConnectors } from './getTestConnectors'
// import writeToFile from '../tools/utils/writeLog'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const { logicModule, authorizer, fundingManager, paymentProcessor } =
    await getWorkflow({
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

  // it('Should Log The Compiled Workflow Object', () => {
  //   const { erc20Contract, ...rest } = workflow

  //   writeToFile(rest, 'WorkflowObject')
  //   expect(workflow).pass()
  // })

  it('logicModule read getBountyInformation', async () => {
    const res = await logicModule.read.getBountyInformation.run('51')
    expect(res).toBeInstanceOf(Object)
  })

  it('logicModule simulate addBounty', async () => {
    const simRes = await logicModule.simulate.addBounty.run([
      '100',
      '2000',
      ['this is an inverter project'],
    ])

    expect(simRes).toBeString()
  })

  it('paymentProcessor read token', async () => {
    const res = await paymentProcessor.read.token.run()
    expect(res).toBeString()
  })

  it('fundingManager read token', async () => {
    const res = await fundingManager.read.token.run()
    expect(res).toBeString()
  })

  it('fundingManager simulate deposit', async () => {
    const simRes = await fundingManager.simulate.deposit.run('100')
    expect(simRes).toBeInstanceOf(Array)
  })

  it('authorizer read owner role', async () => {
    const res = await authorizer.read.getOwnerRole.run()
    expect(res).toBeString()
  })

  it('authorizer simulate grantRole', async () => {
    const simRes = await authorizer.simulate.grantRole.run([
      '0x3078303100000000000000000000000000000000000000000000000000000000',
      '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
    ])
    expect(simRes).toBeArray()
  })
})
