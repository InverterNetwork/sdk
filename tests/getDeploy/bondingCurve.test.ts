import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src/Inverter'
import { isAddress } from 'viem'
import type { GetUserArgs } from '../../src'
import { getDeployArgs } from '../testHelpers/getTestArgs'

const requestedModules = {
  fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
  authorizer: 'AUT_Roles_v1',
  paymentProcessor: 'PP_Simple_v1',
} as const

const userArgs: GetUserArgs<typeof requestedModules> = getDeployArgs(
  requestedModules,
  '0x5AeeA3DF830529a61695A63ba020F01191E0aECb'
)

describe('#getDeploy', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const sdk = new Inverter({ publicClient, walletClient })

  describe('Modules: BondingCurve, AUT_Roles_v1, PP_Simple_v1', () => {
    describe('simulate', () => {
      it(
        'returns the orchestrator address as result',
        async () => {
          const { simulate } = await sdk.getDeploy({ requestedModules })

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
