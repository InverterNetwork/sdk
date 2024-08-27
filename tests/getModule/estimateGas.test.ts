import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import getModule from '../../src/getModule'

describe('Should estimate a write methods gas', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'ERC20Issuance_v1',
      address: '0xb5e5e7ac214c2c559f60b7905507c967f62e6f88',
      publicClient,
      walletClient,
      extras: {
        decimals: 18,
        defaultToken: '0xb5e5e7ac214c2c559f60b7905507c967f62e6f88',
        walletAddress: walletClient.account.address,
      },
    })

  it('Estimate the gas', async () => {
    const res = await moduleObj.estimateGas.mint.run([
      walletClient.account.address,
      '10000',
    ])

    expect(res).toContainKeys(['value', 'formatted'])
  })
})
