import { expect, describe, it } from 'bun:test'
import writeLog from '../../tools/writeLog'
import { getDeploy } from '../../src'
import { getTestConnectors } from '../getTestConnectors'

describe('main', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  it('Should log the Deploy Function possible inputs', async () => {
    const res = getDeploy(publicClient, walletClient, {
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
    })

    // const t = (await res).inputs.fundingManager.name

    writeLog({
      content: res,
      label: 'DeploySchema',
    })

    expect(res).toBeObject()
  })
})
