import { expect, describe, it } from 'bun:test'

import { sdk } from 'tests/helpers'

const requestedModules = {
  fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
  authorizer: 'AUT_Roles_v1',
  paymentProcessor: 'PP_Simple_v1',
} as const

const orchestratorAddress =
  // TODO: Actually Deploy this orchestrator
  '0xCDfC7e4a5F377816C9bA533D45F269198Ef1F910' as `0x${string}`

describe('#getModule decimals error', () => {
  describe('Simulate with decoded error and not decoded error', async () => {
    const workflow = await sdk.getWorkflow({
      orchestratorAddress,
      requestedModules,
    })

    it(
      'finds the name of the error by decoding error signature',
      async () => {
        try {
          // TODO: Assign the correct permission
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
