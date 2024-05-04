import { expect, describe, it } from 'bun:test'
import getDeploySchema from '../../src/getDeploy/getDeploySchema'
import writeLog from '../../tools/writeLog'

describe('main', async () => {
  it('Should log the Deploy Function possible inputs', async () => {
    const res = getDeploySchema({
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

    writeLog({
      content: res,
      label: 'DeploySchema',
    })

    expect(res).toBeObject()
  })
})
