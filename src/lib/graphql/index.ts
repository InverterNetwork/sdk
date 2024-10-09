import { generateQueryOp } from './build'
import type {
  query_rootGenqlSelection,
  QueryResult,
  subscription_rootGenqlSelection,
} from './build'
import client from './client'
import { SubscriptionManager } from './utils'

export type GraphQLQueryArgs = query_rootGenqlSelection & { __name?: string }
export type GraphQLQueryResult<T extends GraphQLQueryArgs> = QueryResult<T>

const query = async <T extends GraphQLQueryArgs>(
  fields: T
): Promise<GraphQLQueryResult<T>> => {
  const { query, variables } = generateQueryOp(fields)

  const data = await client.query(query, variables)

  return data.data
}

export type GraphQLSubscriptionArgs = subscription_rootGenqlSelection & {
  __name?: string
}
export type GraphQLSubscriptionResult<T extends GraphQLSubscriptionArgs> =
  SubscriptionManager<T>

const subscription = async <T extends GraphQLSubscriptionArgs>(
  fields: T
): Promise<GraphQLSubscriptionResult<T>> => {
  const subscriptionManager = SubscriptionManager.getInstance(fields)

  return subscriptionManager
}

const graphql = {
  query,
  subscription,
}

export * from './constants'
export default graphql
