import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import getModule from '../src/getModule'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'Orchestrator_v1',
      address: '0x4B3a97fE6588b6E2731a4939aA633dc4A86c0636',
      publicClient,
      walletClient,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.listModules.run()
    console.log('Version Res: \n', res)
    expect(res).toBeArray()
  })
})
