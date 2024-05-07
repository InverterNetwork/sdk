import { expect, describe, it } from 'bun:test'
import writeLog from '../../tools/writeLog'
import { getDeploy } from '../../src'
import { getTestConnectors } from '../getTestConnectors'
import { RequestedModules } from '../../src/getDeploy/types'

describe('#DEPLOY_INPUTS', async () => {
  const { walletClient, publicClient } = getTestConnectors()

  const requestedModules = {
    authorizer: {
      name: 'RoleAuthorizer',
      version: '1',
    },
    fundingManager: {
      name: 'RebasingFundingManager',
      version: '1',
    },
    paymentProcessor: {
      name: 'SimplePaymentProcessor',
      version: '1',
    },
    optionalModules: [
      {
        name: 'BountyManager',
        version: '1',
      },
    ],
  } satisfies RequestedModules

  const { inputs } = await getDeploy(
    publicClient,
    walletClient,
    requestedModules
  )

  writeLog({
    content: inputs,
    label: 'deploy_schema',
  })

  it('Has all the keys', () => {
    expect(inputs).toContainKeys(Object.keys(requestedModules))
  })

  it('Has optioanal modules', () => {
    expect(inputs.optionalModules).toBeArrayOfSize(
      requestedModules.optionalModules.length
    )
  })
})
