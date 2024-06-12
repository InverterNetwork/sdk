import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { isAddress } from 'viem'
// import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

const userArgs = {
  orchestrator: {
    independentUpdates: false,
    independentUpdateAdmin: '0x0000000000000000000000000000000000000000',
  },
  authorizer: {
    initialAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
  },
  fundingManager: {
    bondingCurveParams: {
      buyIsOpen: true,
      sellIsOpen: true,
      formula: '0x823F6AC80759F2e037eaF706d45CB4B47b80926c',
      reserveRatioForBuying: '333333',
      reserveRatioForSelling: '33333',
      buyFee: '0',
      sellFee: '100',
      initialTokenSupply: '100',
      initialCollateralSupply: '33',
    },
    issuanceToken: {
      name: 'MG',
      symbol: 'MG',
      decimals: '18',
      maxSupply: '1000000',
    },
    tokenAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
    acceptedToken: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
  },
} as const

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors('optimismSepolia')
  const sdk = new Inverter(publicClient, walletClient)

  describe('Modules: BondingCurve, AUT_Roles_v1, PP_Simple_v1', () => {
    describe('simulate', () => {
      it(
        'returns the orchestrator address as result',
        async () => {
          const { simulate } = await sdk.getDeploy({
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
