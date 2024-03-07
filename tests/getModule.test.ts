import { expect, describe, it } from 'bun:test'

import getModule from '../src/getModule'
import { getTestConnectors } from './getTestConnectors'
import writeToFile from '../tools/utils/writeLog'

describe('Get A Module', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const module = getModule({
    name: 'BountyManager',
    version: 'v1.0',
    address: '0xc24f66A74967c336c8Cd529308c193b05Ac3e02f',
    publicClient,
    walletClient,
    extras: {
      decimals: 18,
    },
  })

  it('Should Log The Compiled Module Object', () => {
    writeToFile(module, 'FullModuleObject')
    expect(module).pass()
  })

  it('Should post a bounty', async () => {
    const simRes = await module.simulate.addBounty.run([
      '100',
      '1000',
      ['this is an inverter project'],
    ])

    const res = await module.write.addBounty.run([
      '100',
      '1000',
      ['this is an inverter project'],
    ])
    console.log('addBounty RES', res)
    expect(res).pass()
  })

  it('Should list and read a bounty', async () => {
    const bountyIds = await module.read.listBountyIds.run()
    console.log('Bounty IDS', bountyIds)

    const res = await module.read.getBountyInformation.run('51')
    console.log('getBountyInformation RES', res)
    expect(res).pass()
  })
})
