import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src'

describe('#deployERC20', async () => {
  const { publicClient, walletClient } = getTestConnectors()

  const sdk = new Inverter({ publicClient, walletClient })

  it(
    'should run the deployer function',
    async () => {
      const data = await sdk.deploy('ERC20Issuance', {
        name: 'My Token',
        symbol: 'MT',
        decimals: 18,
        maxSupply: '1000000',
        initialAdmin: walletClient.account.address,
      })

      console.log('Deployed ERC20Issuance:', data.tokenAddress)

      expect(data).toContainKeys(['tokenAddress', 'transactionHash'])
    },
    {
      timeout: 60_000,
    }
  )
})
