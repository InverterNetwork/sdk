import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from '@urql/core'
import { DEFAULT_GRAPHQL_URL } from './constants'
import { SubscriptionClient } from 'subscriptions-transport-ws'

const subscriptionClient = new SubscriptionClient(DEFAULT_GRAPHQL_URL, {})

const client = new Client({
  url: DEFAULT_GRAPHQL_URL,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
})

export default client
