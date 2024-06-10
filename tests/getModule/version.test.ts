import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import getModule from '../../src/getModule'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'LM_PC_PaymentRouter_v1',
      address: '0xDdCe84621cB7844C0D91307733F6EaC19C7f6417',
      publicClient,
      walletClient,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.version.run()
    console.log('Version Res: \n', res)
    expect(res).toBeArray()
  })
})
