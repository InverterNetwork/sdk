import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { assertRequest, decodeErrorResult } from 'viem'
import { GetUserArgs, RequestedModules } from '../../src'
import { getModuleData } from '@inverter-network/abis'

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

const getErrorName = (
  requestedModules: RequestedModules,
  signature: `0x${string}`
) => {
  let errorName: string | undefined

  Object.values(requestedModules)
    .flat()
    .forEach((module) => {
      try {
        const abi = getModuleData(module).abi
        const value = decodeErrorResult({
          abi,
          data: signature,
        })
        if (value.errorName) errorName = value.errorName
      } catch {
        // do nothing
      }
    })

  return errorName
}

describe('#getDeploy decimals error', () => {
  const { publicClient, walletClient } = getTestConnectors('sepolia')

  describe('Simulate with decoded error and not decoded error', async () => {
    const sdk = new Inverter(publicClient, walletClient)
    const { simulate } = await sdk.getDeploy(requestedModules)

    it(
      'finds the name of the error by decoding error signature',
      async () => {
        try {
          await simulate(userArgs)
        } catch (e: any) {
          if (!e?.message?.includes?.('Unable to decode signature')) throw e

          const signature = e.cause.signature as `0x${string}`
          const errorName = getErrorName(requestedModules, signature)

          if (!errorName) throw e

          console.error(errorName)

          expect(errorName).toBeDefined()
        }
      },
      {
        timeout: 20000,
      }
    )
  })
})
