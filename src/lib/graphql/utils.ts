import { gql } from '@urql/core'
import type { FormattedGraphQLParams } from './types'
import client from './client'

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

export const queryWrapper = async <T extends object, N extends string>({
  name,
  params,
  project,
}: {
  name: N
  params?: FormattedGraphQLParams<T>
  project: Array<keyof T>
}) => {
  const document = getDocument({ name, params, project })
  const response = await client.query(document, {}).toPromise()
  const data = response.data
  return data
}
