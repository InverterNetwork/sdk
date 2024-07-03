import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { decodeErrorResult } from 'viem'
import { GetUserArgs } from '../../src'
import { getModuleData } from '@inverter-network/abis'

const errorName =
  'Module__FM_BC_Bancor_Redeeming_VirtualSupply__InvalidTokenDecimal'

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
    issuanceToken: {
      name: 'MG Token',
      symbol: 'MG',
      decimals: '9',
      maxSupply: '1000000',
    },
    tokenAdmin: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
    collateralToken: '0x71bd16Dd7A120a12a27439F5D3767Be795d4A991',
  },
}

describe('#getDeploy decimals error', () => {
  const { publicClient, walletClient } = getTestConnectors('sepolia')
  const sdk = new Inverter(publicClient, walletClient)

  describe('Modules: BondingCurve, AUT_Roles_v1, PP_Simple_v1', () => {
    describe('simulate', () => {
      it(
        'finds the name of the error by decoding error signature',
        async () => {
          const abi = getModuleData(
            'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1'
          ).abi
          const { simulate } = await sdk.getDeploy(requestedModules)

          try {
            await simulate(userArgs)
          } catch (e) {
            const signature = e.cause.signature

            const value = decodeErrorResult({
              abi,
              data: signature,
            })

            console.log(value)

            expect(value.errorName).toEqual(errorName)
          }
        },
        {
          timeout: 20000,
        }
      )
    })
  })
})
