import { expect, describe, it } from 'bun:test'

import getModule from '../../src/getModule'
import { getTestConnectors } from '../getTestConnectors'
import utils from '../../tools'

describe('Get A Module', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const module = getModule({
    name: 'LM_PC_Bounties_v1',
    address: '0xa23D85d8FE256a8a1eE92a6d5Ec156a8a21DCdaE',
    publicClient,
    walletClient,
    extras: {
      decimals: 18,
    },
  })

  it('Should Log The Compiled Module Object', async () => {
    console.log(Object.keys(module))
    utils.writeLog({
      content: module,
      label: 'FullModuleObject',
      format: 'json',
    })
    expect(module).pass()
  })

  // it('Should post a bounty', async () => {
  //   const simRes = await module.simulate.addBounty.run([
  //     '100',
  //     '1000',
  //     ['this is an inverter project'],
  //   ])
  //   console.log('addBounty SIM RES', simRes)
  //   const res = await module.write.addBounty.run([
  //     '100',
  //     '1000',
  //     ['this is an inverter project'],
  //   ])
  //   console.log('addBounty RES', res)
  //   expect(res).pass()
  // })

  // it('Should list and read a bounty', async () => {
  //   const bountyIds = await module.read.listBountyIds.run()
  //   console.log('Bounty IDS', bountyIds)

  //   const res = await module.read.getBountyInformation.run('51')
  //   console.log('getBountyInformation RES', res)
  //   expect(res).pass()
  // })
})
