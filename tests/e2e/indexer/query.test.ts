import graphql from '@/lib/graphql'
import { expect, describe, it } from 'bun:test'

describe.skip('#INDEXER_QUERY', () => {
  it('1. Should Query The Swap Endpoint And Confirm The Result', async () => {
    const response = await graphql.query({
      Swap: {
        __name: 'Swap',
        __args: {
          where: {
            id: {
              _eq: '4-0x5d346fd9e1070d1f1874e894feccbfad11ae9761c29169c4e58c8c7043f2beec',
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
