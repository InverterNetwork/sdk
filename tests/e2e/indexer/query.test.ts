import { query } from '@/lib/graphql'
import { expect, describe, it } from 'bun:test'

describe('#INDEXER_GET', () => {
  it('1. Should Query The Swap Endpoint And Confirm The Result', async () => {
    const response = await query.Swap({
      params: {
        where: {
          id: {
            _eq: '4-0x5d346fd9e1070d1f1874e894feccbfad11ae9761c29169c4e58c8c7043f2beec',
          },
        },
      },
      project: ['id'],
    })

    expect(response?.Swap).toBeArray()
  })
})
