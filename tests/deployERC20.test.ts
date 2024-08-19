import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from './testHelpers/getTestConnectors'
import { Inverter } from '../src'

describe('#deployERC20', async () => {
  const { publicClient, walletClient } = getTestConnectors()

  const sdk = new Inverter({ publicClient, walletClient })

  it(
    'should run the deployer function',
    async () => {
      const data = await sdk.deployERC20({
        name: 'My Token',
        symbol: 'MT',
        decimals: 18,
        initialSupply: '1000000',
        initialAdmin: walletClient.account.address,
      })

      console.log('Deployed ERC20:', data.tokenAddress)

      expect(data).toContainKeys(['tokenAddress', 'transactionHash'])
    },
    {
      timeout: 60_000,
    }
  )
})
