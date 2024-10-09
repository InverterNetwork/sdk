import { generateQueryOp } from './build'
import type {
  query_rootGenqlSelection,
  QueryResult,
  subscription_rootGenqlSelection,
} from './build'
import client from './client'
import { SubscriptionManager } from './utils'

const query = async <T extends query_rootGenqlSelection & { __name?: string }>(
  fields: T
): Promise<QueryResult<T>> => {
  const { query, variables } = generateQueryOp(fields)

  const data = await client.query(query, variables)

  return data.data
}

const subscription = async <
  T extends subscription_rootGenqlSelection & { __name?: string },
>(
  fields: T
) => {
  const subscriptionManager = new SubscriptionManager(fields)

  return subscriptionManager
}

const graphql = {
  query,
  subscription,
}

export * from './constants'
export default graphql
