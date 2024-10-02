import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
  type ExecutionResult,
  type SubscriptionForwarder,
} from '@urql/core'
import { DEFAULT_GRAPHQL_URL } from './constants'
import type { ObservableLike } from 'type-fest-4'

// Define forwardSubscription function
const forwardSubscription: SubscriptionForwarder =
  (): ObservableLike<ExecutionResult> => {
    return {
      subscribe: (observer) => {
        // Simulate an observable with no data
        const intervalId = setInterval(() => {
          observer?.next?.({ data: null })
        }, 1000)

        return {
          unsubscribe: () => clearInterval(intervalId),
        }
      },
      [Symbol.observable]() {
        return this
      },
    }
  }

const client = new Client({
  url: DEFAULT_GRAPHQL_URL,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription,
    }),
  ],
})

export default client
