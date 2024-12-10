import graphql from '@/lib/graphql'
import { expect, describe, it } from 'bun:test'

describe('#INDEXER_QUERY', () => {
  it('1. Should Query The Swap Endpoint And Confirm The Result', async () => {
    const response = await graphql.query({
      Swap: {
        __name: 'Swap',
        __args: {
          where: {
            id: {
              _eq: '0x5823966fbeb988858d3232a89071d7ed640cb4f329a026a19b7fe64f23a8a756-17',
            },
          },
        },
        id: true,
      },
    })

    expect(response?.Swap).toBeObject()
    expect(response?.Swap[0].id).toBeString()
  })
})
