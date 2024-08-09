import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'

const requestedModules = {
  fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
  authorizer: 'AUT_Roles_v1',
  paymentProcessor: 'PP_Simple_v1',
} as const

const orchestrator =
  // this orchestrator belongs to mguleryuz test account
  '0xCDfC7e4a5F377816C9bA533D45F269198Ef1F910' as `0x${string}`

describe('#getModule decimals error', () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('Simulate with decoded error and not decoded error', async () => {
    const sdk = new Inverter(publicClient, walletClient)
    const workflow = await sdk.getWorkflow(orchestrator, requestedModules)

    it.skip(
      'finds the name of the error by decoding error signature',
      async () => {
        try {
          // Should throw error since no permisson was given
          await workflow.fundingManager.simulate.buy.run([
            '1000000',
            '10000001',
          ])
        } catch (e: any) {
          const message = e?.message

          console.error(message)

          expect(message).toBeDefined()
        }
      },
      {
        timeout: 20000,
      }
    )
  })
})
