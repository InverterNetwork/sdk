import { expect, describe, it, beforeAll } from 'bun:test'

import getModule from '../src/getModule'
import { getTestConnectors } from './getTestConnectors'
import writeToFile from '../tools/utils/writeLog'

describe('Get A Module', () => {
  let module: ReturnType<typeof getModule<'BountyManager', 'v1.0'>>

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
    writeToFile(module, 'FullModuleObject')
    expect(module).pass()
  })

  it('Should post a bounty', async () => {
    const res = await module.write.addBounty.run([
      { value: '100', decimals: 18 },
      { value: '1000', decimals: 18 },
      {},
    ])

    console.log('addBounty RES', res)
    expect(res).pass()
  })

  it('Should read a bounty', async () => {
    const res = await module.read.getClaimInformation.run('3')

    console.log('listBountyIds RES', res)
    expect(res).pass()
  })
})