import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import getModule from '../../src/getModule'
import { deployedBCFundingManager } from '../testHelpers/getTestArgs'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
      address: deployedBCFundingManager,
      publicClient,
      walletClient,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.version.run()
    expect(res).toBeArray()
  })
})
