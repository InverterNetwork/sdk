import { expect, describe, it } from 'bun:test'

import { sdk } from 'tests/helpers'

describe('Get A Module', async () => {
  const module = sdk.getModule({
    name: 'LM_PC_Bounties_v1',
    address: '0xa1d66817BB0eCA86A56662887f455D2409a30884',
    extras: {
      decimals: 18,
      defaultToken: '0xd5018fA63924d1BE2C2C42aBDc24bD754499F97c',
    },
  })

  it('Should post a bounty', async () => {
    const simRes = await module.simulate.addBounty.run([
      '100',
      '1000',
      ['this is an inverter project'],
    ])

    expect(simRes.result).toBeString()
  })

  it('Should list and read a bounty', async () => {
    const bountyIds = await module.read.listBountyIds.run()

    const res = await module.read.getBountyInformation.run(bountyIds[0])

    expect(bountyIds).toBeArray()
    expect(res).toContainKeys([
      'minimumPayoutAmount',
      'maximumPayoutAmount',
      'details',
      'locked',
    ])
  })
})
