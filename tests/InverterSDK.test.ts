import { describe, it, beforeEach } from 'bun:test'

import { InverterSDK } from '../src/inverterSdk'
import { getTestConnectors } from './getTestConnectors'

describe('InverterSDK', () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('instantiation', () => {
    const orchestratorAddress = '0x614aFB457ad58f15ED7b32615417c628e30C0c65'

    let sdk: InverterSDK

    beforeEach(async () => {
      sdk = new InverterSDK(publicClient, walletClient)
      await sdk.addWorkflow(orchestratorAddress, {
        authorizer: 'AUT_Roles_v1',
        fundingManager: 'FM_Rebasing_v1',
        paymentProcessor: 'PP_Simple_v1',
        logicModules: ['LM_PC_Bounties_v1'],
      })
    })

    it('instantiates the sdk', async () => {
      const w = sdk.getWorkflow(orchestratorAddress)
    })
  })
})
