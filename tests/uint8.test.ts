import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './getTestConnectors'
import { getContract } from 'viem'
import { getModuleData } from '@inverter-network/abis'

describe('Should get the verion from a module', async () => {
  const { publicClient, walletClient } = getTestConnectors(),
    moduleObj = getContract({
      address: '0xdbEdA5eD0d488f892C747217aF9f86091F5Ec4A7',
      client: { public: publicClient, wallet: walletClient },
      abi: getModuleData('ERC20', '1').abi,
    })

  it('Fetch the version', async () => {
    const res = await moduleObj.read.decimals()
    const total = await moduleObj.read.totalSupply()
    console.log(
      'total supply type: \n',
      typeof total,
      '\n total supply: \n',
      total,
      '\n decimals type: \n',
      typeof res,
      '\n decimals: \n',
      res
    )
    expect(res).pass()
  })
})
