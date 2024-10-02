import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { DEFAULT_GRAPHQL_URL } from './constants'

const client = new Client({
  url: DEFAULT_GRAPHQL_URL,
  exchanges: [cacheExchange, fetchExchange],
})

export default client
