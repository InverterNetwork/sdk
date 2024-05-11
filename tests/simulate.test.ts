import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getContract } from 'viem'
import { getModuleData } from '@inverter-network/abis'

describe('Test out the simulate of getContract', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    contract = getContract({
      client: { public: publicClient, wallet: walletClient },
      address: '0xc24f66A74967c336c8Cd529308c193b05Ac3e02f',
      abi: getModuleData('LM_PC_Bounties_v1').abi,
    })

  it('Should simulate the addBounty', async () => {
    const res = await contract.simulate.addBounty(
      [100000000000000000000n, 2000000000000000000000n, '0x'],
      {
        account: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
      }
    )
    console.log('addBounty RES', res)
    expect(res).toBeObject()
  })
})
