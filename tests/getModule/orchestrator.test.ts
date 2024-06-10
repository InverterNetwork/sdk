import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import getModule from '../../src/getModule'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'Orchestrator_v1',
      address: '0xBc986B80A3c6b274CEd09db5A3b0Ac76a4046968',
      publicClient,
      walletClient,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.listModules.run()
    console.log('Version Res: \n', res)
    expect(res).toBeArray()
  })
})
