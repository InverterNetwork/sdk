import { expect, describe, it, beforeAll } from 'bun:test'

import getModule from '../src/getModule'
import { getTestConnectors } from './getTestConnectors'
import writeToFile from '../tools/utils/writeLog'

describe('Get A Module', () => {
  let module: ReturnType<typeof getModule>

  beforeAll(async () => {
    const { publicClient, walletClient } = getTestConnectors()
    module = getModule({
      name: 'BountyManager',
      version: 'v1.0',
      address: '0xc24f66A74967c336c8Cd529308c193b05Ac3e02f',
      publicClient,
      walletClient,
    })
  })

  it('Should Log The Compiled Module Object', () => {
    writeToFile(module)
    expect(module).pass()
  })

  it('Should test any method', async () => {
    const res = await module.methods.listBountyIds.run({ args: [] })

    console.log('listBountyIds RES', res)
    expect(res).pass()
  })
})
