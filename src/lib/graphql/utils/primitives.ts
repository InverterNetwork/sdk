import { gql } from '@urql/core'
import type { FormattedGraphQLParams } from '../types'
import client from '../client'
import SubscriptionManager from './SubscriptionManager'

/**
 * Formats the `order_by` object into a GraphQL-compatible string.
 * @template T - The type of the entity's fields to order by.
 * @param orderBy - A partial record where the keys are the field names and values are the order direction (e.g., 'asc' or 'desc').
 * @returns A formatted string for `order_by` to be used in a GraphQL query.
 */
const formatOrderBy = <T extends object>(
  orderBy: Partial<Record<keyof T, string>>
): string => {
  return `{ ${Object.entries(orderBy)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')} }`
}

/**
 * Formats the `where` clause into a GraphQL-compatible string.
 * @template T - The type of the entity's fields to filter by.
 * @param where - A partial record where the keys are the field names and values are the filter conditions.
 * @returns A formatted string for `where` to be used in a GraphQL query.
 */
const formatWhere = <T extends object>(
  where: Partial<Record<keyof T, any>>
): string => {
  const formatValue = (value: any): string =>
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? `{ ${Object.entries(value)
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join(', ')} }`
      : JSON.stringify(value)

  return `{ ${Object.entries(where)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join(', ')} }`
}

/**
 * Formats the GraphQL query parameters (e.g., where, order_by, limit).
 * @template T - The type of the entity's fields.
 * @param params - The parameters for the GraphQL query.
 * @returns A formatted string representing the query parameters.
 */
export const formatParams = <T extends object>(
  params?: FormattedGraphQLParams<T>
): string => {
  if (!params || Object.keys(params).length === 0) return ''

  const parts: string[] = []

  if (params.distinct_on) parts.push(`distinct_on: ${params.distinct_on}`)
  if (params.limit) parts.push(`limit: ${params.limit}`)
  if (params.offset) parts.push(`offset: ${params.offset}`)
  if (params.order_by) parts.push(`order_by: ${formatOrderBy(params.order_by)}`)
  if (params.where) parts.push(`where: ${formatWhere(params.where)}`)

  return `(${parts.join(', ')})`
}

/**
 * Selects specific fields for the GraphQL query.
 * @template T - The type of the entity's fields.
 * @param fields - An array of field names to be selected.
 * @returns A string representing the fields to be selected in the query.
 */
export function selectGraphQLFields<T extends object>(
  fields: Array<keyof T>
): string {
  return fields.join('\n')
}

/**
 * Generates a GraphQL query document using the provided parameters and selected fields.
 * @template T - The type of the entity's fields.
 * @param params - An object containing the query name, parameters, and fields to select.
 * @returns A GraphQL query document.
 */
export const getDocument = <T extends object, N extends string>(params: {
  name: N
  params?: FormattedGraphQLParams<T>
  project: Array<keyof T>
}) => {
  return gql<{ [K in N]: T[] }>`
    {
      ${params.name}${formatParams(params.params)} {
        ${selectGraphQLFields(params.project)}
      }
    }
  `
}

/**
 * Generates a GraphQL subscription document using the provided parameters and selected fields.
 * @template T - The type of the entity's fields.
 * @param params - An object containing the subscription name, parameters, and fields to select.
 * @returns A GraphQL subscription document.
 */
export const getSubscriptionDocument = <
  T extends object,
  N extends string,
>(params: {
  name: N
  params?: FormattedGraphQLParams<T>
  project: Array<keyof T>
}) => {
  return gql<{ [K in N]: T[] }>`
    subscription {
      ${params.name}${formatParams(params.params)} {
        ${selectGraphQLFields(params.project)}
      }
    }
  `
}

/**
 * Wrapper function for executing GraphQL queries using URQL client.
 * It allows dynamically constructing the query document and selecting specific fields to be returned.
 *
 * @template T - The type representing the structure of the GraphQL entity's fields.
 * @template N - The name of the GraphQL query (e.g., 'Swap', 'BondingCurve').
 *
 * @param {Object} params - An object containing the query details.
 * @param {N} params.name - The name of the GraphQL query.
 * @param {FormattedGraphQLParams<T>} [params.params] - Optional query parameters like filtering (`where`), ordering (`order_by`), and limits (`limit`).
 * @param {Array<keyof T>} params.project - An array of keys that specify which fields to select from the query result.
 */
export const queryWrapper = async <T extends object, N extends string>({
  name,
  params,
  project,
}: {
  name: N
  params?: FormattedGraphQLParams<T>
  project: Array<keyof T>
}) => {
  // Dynamically construct the query document with selected fields and parameters
  const document = getDocument({ name, params, project })

  // Execute the query using the URQL client and wait for the result
  const response = await client.query(document, {}).toPromise()

  // Return the data from the response, or null if no data is available
  const data = response.data

  return data
}

/**
 * Wrapper for subscribing to GraphQL subscriptions.
 * Allows dynamic subscription management by adding or removing callbacks for a specific subscription.
 *
 * @template T - The type representing the structure of the GraphQL entity's fields.
 * @param params - An object containing the following properties:
 *  - `name`: The name of the GraphQL subscription (e.g., 'Swap', 'BondingCurve').
 *  - `params`: Optional parameters like filtering (`where`), ordering (`order_by`), and limits (`limit`) for the subscription.
 *  - `project`: An array of keys that specify which fields to select from the subscription result.
 * @returns {SubscriptionManager<T>} A new instance of the `SubscriptionManager` that allows adding/removing callbacks for handling the subscription events.
 */
export const subscriptionWrapper = <
  T extends object,
  N extends string,
>(params: {
  name: N
  params?: FormattedGraphQLParams<T>
  project: Array<keyof T>
}): SubscriptionManager<T> => {
  // Create the subscription document using urql's gql and utilities
  const document = getSubscriptionDocument(params)

  // Get an instance of the SubscriptionManager
  const subscriptionManager = new SubscriptionManager<T>(document)

  // Return the subscription manager to allow adding/removing callbacks
  return subscriptionManager
}
