import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { isAddress } from 'viem'
import type { GetUserArgs } from '../../src'

const requestedModules = {
  fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
  authorizer: 'AUT_Roles_v1',
  paymentProcessor: 'PP_Simple_v1',
} as const

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

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const sdk = new Inverter(publicClient, walletClient)

  describe('Modules: BondingCurve, AUT_Roles_v1, PP_Simple_v1', () => {
    describe('simulate', () => {
      it(
        'returns the orchestrator address as result',
        async () => {
          const { simulate } = await sdk.getDeploy(requestedModules)

          const simulationResult = await simulate(userArgs)

          expect(isAddress(simulationResult.result as string)).toBeTrue
        },
        {
          timeout: 20000,
        }
      )
    })
  })
})
