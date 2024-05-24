import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../getTestConnectors'
import getModule from '../../src/getModule'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'Module',
      address: '0xa23D85d8FE256a8a1eE92a6d5Ec156a8a21DCdaE',
      publicClient,
      walletClient,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.version.run()
    console.log('Version Res: \n', res)
    expect(res).toBeArray()
  })
})
