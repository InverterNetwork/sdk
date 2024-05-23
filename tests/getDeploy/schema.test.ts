import { expect, describe, it } from 'bun:test'
import writeLog from '../../tools/writeLog'
import { getDeploy } from '../../src'
import { getTestConnectors } from '../getTestConnectors'

describe('main', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  it('Should log the Deploy Function possible inputs', async () => {
    const res = getDeploy(publicClient, walletClient, {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    })

    // const t = (await res).inputs.fundingManager.name

    writeLog({
      content: res,
      label: 'DeploySchema',
    })

    expect(res).toBeObject()
  })
})
