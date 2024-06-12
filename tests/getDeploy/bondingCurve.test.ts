import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { getDeploy } from '../../src'
import { isAddress } from 'viem'
// import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

const userArgs = {
  authorizer: {
    initialAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
  },
  fundingManager: {
    bondingCurveParams: {
      buyIsOpen: true,
      sellIsOpen: true,
      formula: '0x5c335736fD2ec911C56803C75401BecBDd6Ba6E0',
      reserveRatioForBuying: '3000000',
      reserveRatioForSelling: '3000000',
      buyFee: '0',
      sellFee: '100',
      initialTokenSupply: '5000000',
      initialCollateralSupply: '1000000',
    },
    issuanceToken: {
      name: 'ZAP Token',
      symbol: 'ZAP',
      decimals: '18',
      maxSupply: '10000000',
    },
    tokenAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
    acceptedToken: '0xa14bD2b0A50F858BbE71b5FEF61Cd68b0DC328f2',
  },
} as const

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors('optimismSepolia')

  describe('Modules: BondingCurve, AUT_Roles_v1, PP_Simple_v1', () => {
    describe('simulate', () => {
      it(
        'returns the orchestrator address as result',
        async () => {
          const { simulate } = await getDeploy(publicClient, walletClient, {
            fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
            authorizer: 'AUT_Roles_v1',
            paymentProcessor: 'PP_Simple_v1',
          })
          const simulationResult = await simulate(userArgs)
          expect(isAddress(simulationResult.result as string)).toBeTrue
        },
        {
          timeout: 10000,
        }
      )
    })
  })
})
