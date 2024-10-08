import fs from 'fs'
import path from 'path'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
} from 'graphql'
import { DEFAULT_GRAPHQL_URL } from '../constants'

// Fetch the introspected schema from a GraphQL endpoint
async function fetchSchema(endpoint: string): Promise<GraphQLSchema> {
  const introspectionQuery = getIntrospectionQuery()
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: introspectionQuery }),
  })

  const { data } = await response.json()
  return buildClientSchema(data)
}

// Helper function to generate import statements
function generateImports(fields: string[]) {
  const typeImports = fields.map((field) => `GQL${field}`).join(',\n  ')

  const fileContent = `
import * as utils from '../utils'
import type { FormattedGraphQLParams } from '..'
import type {
  ${typeImports}
} from './types'
  `

  return fileContent.trim()
}

function generateInnerDataTypes(fields: string[]) {
  const typeImports = fields.map((field) => `GQL${field}`).join(',\n  ')

  const fileContent = `
export type {
  ${typeImports}
} from './types'
  `

  return fileContent.trim()
}

// Generate query function
function generateQueryFunctions(fieldName: string) {
  const typeName = `GQL${fieldName}`
  return `
export const ${fieldName} = (args: {
  params?: FormattedGraphQLParams<${typeName}>
  project: Array<keyof ${typeName}>
}) => utils.queryWrapper({ name: '${fieldName}', ...args })
  `.trim()
}

// Generate subscription function
function generateSubscriptionFunctions(fieldName: string) {
  const typeName = `GQL${fieldName}`
  return `
export const ${fieldName}Subscription = (args: {
  params?: FormattedGraphQLParams<${typeName}>
  project: Array<keyof ${typeName}>
}) => utils.subscriptionWrapper({ name: '${fieldName}', ...args })
  `.trim()
}

// Get filtered fields from the schema
function getFilteredFields(schema: GraphQLSchema) {
  const queryType = schema.getQueryType()

  if (!queryType) {
    throw new Error('Query type not found in schema')
  }

  const queryFields = queryType.getFields()

  // Collect only non-lowercase fields and skip by_pk fields
  const filteredFields = Object.keys(queryFields).filter(
    (field) => !/^[a-z]/.test(field) && !field.includes('by_pk')
  )

  return filteredFields
}

// Generate the content of the TypeScript file for queries or subscription
function generateTypeScriptFile(
  filteredFields: string[],
  isSubscription: boolean = false
) {
  // Generate import statements
  let fileContent = generateImports(filteredFields)

  // Generate export functions
  for (const fieldName of filteredFields) {
    const functionGenerator = isSubscription
      ? generateSubscriptionFunctions
      : generateQueryFunctions
    fileContent += `\n\n${functionGenerator(fieldName)}`
  }

  return fileContent
}

// Write the generated content to a TypeScript file
function writeToFile(content: string, outputPath: string) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true }) // Ensure directory exists
  fs.writeFileSync(outputPath, content.trim())
  console.log(`Generated TypeScript file at ${outputPath}`)
}

// Main function to generate both query and subscription TypeScript files
async function main() {
  const endpoint = DEFAULT_GRAPHQL_URL
  const schema = await fetchSchema(endpoint)
  const filteredFields = getFilteredFields(schema)

  // Generate query.ts file
  const queryFilePath = path.join(__dirname, '..', 'build', 'query.ts')
  const queryFileContent = generateTypeScriptFile(filteredFields)
  writeToFile(queryFileContent, queryFilePath)

  // Generate inner-data-types.ts file
  const innerDataTypesPath = path.join(
    __dirname,
    '..',
    'build',
    'inner-data-types.ts'
  )

  const innerDataTypesContent = generateInnerDataTypes(filteredFields)
  writeToFile(innerDataTypesContent, innerDataTypesPath)

  // Generate subscription.ts file
  const subscriptionFilePath = path.join(
    __dirname,
    '..',
    'build',
    'subscription.ts'
  )
  const subscriptionFileContent = generateTypeScriptFile(filteredFields, true)
  writeToFile(subscriptionFileContent, subscriptionFilePath)
}

main().catch(console.error)
