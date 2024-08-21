import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import getModule from '../../src/getModule'
import { deployedBcOrchestrator } from '../testHelpers/getTestArgs'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getModule({
      name: 'Orchestrator_v1',
      address: deployedBcOrchestrator,
      publicClient,
      walletClient,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.listModules.run()
    expect(res).toBeArray()
  })
})
