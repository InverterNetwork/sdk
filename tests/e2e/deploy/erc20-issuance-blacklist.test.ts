import { expect, describe, it } from 'bun:test'

import { sdk } from 'tests/helpers'

describe('#DEPLOY_ERC20_ISSUANCE_BLACKLIST', async () => {
  const deployer = sdk.walletClient.account.address
  let tokenAddress: `0x${string}`

  it('1. Should Deploy The ERC20 Issuance Blacklist Contract', async () => {
    const data = await sdk.deploy({
      name: 'ERC20Issuance_Blacklist_v1',
      args: {
        name: 'My Token',
        symbol: 'MT',
        decimals: 18,
        maxSupply: '1000000',
        initialAdmin: deployer,
      },
    })

    if (!data.contractAddress) throw new Error('Token Address Not Found')

    tokenAddress = data.contractAddress

    expect(data).toContainKeys(['contractAddress', 'transactionHash'])
  })

  it('2. Should getModule && Mint Tokens', async () => {
    const module = sdk.getModule({
      address: tokenAddress,
      name: 'ERC20Issuance_v1',
      extras: {
        decimals: 18,
      },
    })

    expect(module).toBeObject()

    const hash = await module.write.mint.run([deployer, '1000'])

    expect(hash).toBeString()
  })
})
