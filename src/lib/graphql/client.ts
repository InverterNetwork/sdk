import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from '@urql/core'
import { DEFAULT_GRAPHQL_URL } from './constants'
import { SubscriptionClient } from 'subscriptions-transport-ws'

// Convert HTTPS URL to WebSocket URL
const WEBSOCKET_URL = DEFAULT_GRAPHQL_URL.replace('https', 'wss')

const subscriptionClient = new SubscriptionClient(WEBSOCKET_URL, {})

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
