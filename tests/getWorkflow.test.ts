import { expect, describe, it } from 'bun:test'

import getWorkflow from '../src/getWorkflow'
import { getTestConnectors } from './getTestConnectors'
// import utils from '../tools'

describe('Get A Module', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  const workflow = await getWorkflow({
    publicClient,
    walletClient,
    orchestratorAddress: '0x4B3a97fE6588b6E2731a4939aA633dc4A86c0636',
    workflowOrientation: {
      authorizer: {
        name: 'RoleAuthorizer',
        version: '1',
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: '1',
      },
      logicModule: {
        name: 'BountyManager',
        version: '1',
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: '1',
      },
    },
  })

  const { logicModule /* , authorizer, fundingManager, paymentProcessor */ } =
    workflow

  // it('Should Log The Compiled Workflow Object', () => {
  //   utils.writeLog({
  //     content: workflow,
  //     label: 'WorkflowObject',
  //     format: 'json',
  //   })
  //   expect(workflow).pass()
  // })

  it('logicModule read bountyIds', async () => {
    const res = await logicModule.read.listBountyIds.run()
    console.log(res)
    expect(res).toBeInstanceOf(Array)
  })

  // it('logicModule read getBountyInformation', async () => {
  //   const res = await logicModule.read.getBountyInformation.run('51')
  //   console.log(res)
  //   expect(res).toBeInstanceOf(Object)
  // })

  // it('logicModule simulate addBounty', async () => {
  //   const simRes = await logicModule.simulate.addBounty.run([
  //     '100',
  //     '2000',
  //     ['this is an inverter project'],
  //   ])

  //   expect(simRes).toBeString()
  // })

  // it('paymentProcessor read token', async () => {
  //   const res = await paymentProcessor.read.token.run()
  //   expect(res).toBeString()
  // })

  // it('fundingManager read token', async () => {
  //   const res = await fundingManager.read.token.run()
  //   expect(res).toBeString()
  // })

  // it('fundingManager simulate deposit', async () => {
  //   const simRes = await fundingManager.simulate.deposit.run('100')
  //   expect(simRes).toBeInstanceOf(Array)
  // })

  // it('authorizer read owner role', async () => {
  //   const res = await authorizer.read.getOwnerRole.run()
  //   expect(res).toBeString()
  // })

  // it('authorizer simulate grantRole', async () => {
  //   const simRes = await authorizer.simulate.grantRole.run([
  //     '0x3078303100000000000000000000000000000000000000000000000000000000',
  //     '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
  //   ])
  //   expect(simRes).toBeArray()
  // })
})
