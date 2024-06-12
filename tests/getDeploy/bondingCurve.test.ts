import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { getDeploy } from '../../src'
import { isAddress } from 'viem'
import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

const userArgs = {
  authorizer: {
    initialAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
  },
  fundingManager: {
    issuanceToken: {
      name: 'ZAP Token',
      symbol: 'ZAP',
      decimals: '18',
      maxSupply: '10000000',
    },
    tokenAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
    bondingCurveParams: {
      buyIsOpen: true,
      sellIsOpen: true,
      formula: '0x823F6AC80759F2e037eaF706d45CB4B47b80926c',
      // Cant be more than 1M
      reserveRatioForBuying: '1000000',
      // Cant be more than 1M
      reserveRatioForSelling: '1000000',
      buyFee: '0',
      sellFee: '100',
      initialTokenSupply: '100',
      initialCollateralSupply: '33',
    },
    acceptedToken: USDC_SEPOLIA,
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
            fundingManager:
              'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
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
