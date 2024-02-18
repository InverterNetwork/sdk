import { expect, describe, it } from 'bun:test'

import getModule from '../src/getModule'
import { getTestConnectors } from './getTestConnectors'
import writeToFile from '../tools/utils/writeLog'

describe('Get A Module', () => {
  it('Should Log The Compiled Module Object', async () => {
    const { publicClient, walletClient } = getTestConnectors()
    const module = getModule({
      name: 'BountyManager',
      version: 'v1.0',
      address: '0xc24f66A74967c336c8Cd529308c193b05Ac3e02f',
      publicClient,
      walletClient,
    })
    writeToFile(module)
    expect(module).pass()
  })
})
