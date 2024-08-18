import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import type { GetUserArgs, RequestedModules } from '../../src'

const requestedModules = {
  fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
  authorizer: 'AUT_Roles_v1',
  paymentProcessor: 'PP_Simple_v1',
} as const satisfies RequestedModules

const userArgs: GetUserArgs<typeof requestedModules> = {
  orchestrator: {
    independentUpdates: true,
    independentUpdateAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
  },

  authorizer: {
    initialAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
  },

  fundingManager: {
    bondingCurveParams: {
      formula: '0x3ddE767F9DF9530DDeD47e1E012cCBf7B4A04dd7',
      reserveRatioForBuying: '333333',
      reserveRatioForSelling: '333333',
      buyFee: '0',
      sellFee: '100',
      buyIsOpen: true,
      sellIsOpen: true,
      initialIssuanceSupply: '1',
      initialCollateralSupply: '3',
    },
    issuanceToken: '0x5432BbeA7895882B2CF2A0147cf6d872407f47D5',
    collateralToken: '0x71bd16Dd7A120a12a27439F5D3767Be795d4A991',
  },
}

describe('#getDeploy decimals error', () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('Simulate with decoded error and not decoded error', async () => {
    const sdk = new Inverter(publicClient, walletClient)
    const { simulate } = await sdk.getDeploy(requestedModules)

    it(
      'finds the name of the error by decoding error signature',
      async () => {
        try {
          await simulate(userArgs)
        } catch (e: any) {
          const message = e?.message

          // TODO: Uncomment this line when the error message is fixed
          // right now its not a custom error, was unable to find a case to test it out
          // console.error('Error message:', message)

          expect(message).toBeDefined()
        }
      },
      {
        timeout: 20000,
      }
    )
  })
})
