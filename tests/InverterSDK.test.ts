import { describe, it, beforeEach, expect } from 'bun:test'

import { WorkflowOrientation } from '../src/getWorkflow/types'
import { InverterSDK } from '../src/inverterSdk'
import { getTestConnectors } from './getTestConnectors'

interface MyWorkflowOrientation extends WorkflowOrientation {
  authorizer: 'AUT_Roles_v1'
  fundingManager: 'FM_Rebasing_v1'
  paymentProcessor: 'PP_Simple_v1'
  logicModules: ['LM_PC_Bounties_v1']
}

describe('InverterSDK', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const orchestratorAddress = '0x614aFB457ad58f15ED7b32615417c628e30C0c65'
  const workFlowOrientation = {
    authorizer: 'AUT_Roles_v1',
    fundingManager: 'FM_Rebasing_v1',
    paymentProcessor: 'PP_Simple_v1',
    logicModules: ['LM_PC_Bounties_v1'],
  } as MyWorkflowOrientation

  let sdk: InverterSDK

  beforeEach(async () => {
    sdk = new InverterSDK(publicClient, walletClient)
  })

  describe('#constructor', () => {
    it('instantiates the sdk with public and wallet client', async () => {
      expect(sdk.publicClient.type).toEqual('publicClient')
      expect(sdk.walletClient.type).toEqual('walletClient')
    })
  })

  describe('#addWorkflow', () => {
    beforeEach(async () => {
      await sdk.addWorkflow(orchestratorAddress, workFlowOrientation)
    })

    it('adds the workflow to the class instance', () => {
      expect(sdk.workflows.get(orchestratorAddress)).toContainKeys([
        'authorizer',
        'fundingManager',
        'paymentProcessor',
        'erc20Module',
        'orchestrator',
        'logicModule',
      ])
    })
  })

  describe('#getWorkflow', () => {
    beforeEach(async () => {
      await sdk.addWorkflow(orchestratorAddress, workFlowOrientation)
    })

    it('gets the workflow', async () => {
      const workflow =
        sdk.getWorkflow<MyWorkflowOrientation>(orchestratorAddress)

      expect(workflow).toContainKeys([
        'authorizer',
        'fundingManager',
        'paymentProcessor',
        'erc20Module',
        'orchestrator',
        'logicModule',
      ])
    })
  })
})
