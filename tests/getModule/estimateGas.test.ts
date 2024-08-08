import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import getModule from '../../src/getModule'

describe('Should estimate a write methods gas', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      address: '0x04276f9d3424e7a55CEE7A38D8BcDe05C43FeF6D',
      publicClient,
      walletClient,
      extras: {
        decimals: 18,
        defaultToken: '0xd5018fA63924d1BE2C2C42aBDc24bD754499F97c',
        walletAddress: walletClient.account.address,
      },
    })

  it('Estimate the gas', async () => {
    const res = await moduleObj.estimateGas.buy.run(['1000000', '0'])
    console.log('Gas Res: \n', res)
    expect(res).toContainKeys(['value', 'formatted'])
  })
})
