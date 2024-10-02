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

// Generate the content of the TypeScript file based on types
function generateTypeScriptFile(schema: GraphQLSchema) {
  const queryType = schema.getQueryType()

  if (!queryType) {
    throw new Error('Query type not found in schema')
  }

  const queryFields = queryType.getFields()

  // Generate import statements
  let fileContent = `
import { utils } from '..'
import type {
  FormattedGraphQLParams } from '..'
import type {
`

  // Collect type imports
  const types = Object.keys(queryFields)
    .filter((field) => !/^[a-z]/.test(field) && !field.includes('by_pk'))
    .map(
      (field) =>
        `${field} as T${field.charAt(0).toUpperCase() + field.slice(1)}`
    )
    .join(',\n  ')

  fileContent += `  ${types}
} from './types'

`

  // Generate export functions
  for (const fieldName in queryFields) {
    if (/^[a-z]/.test(fieldName) || fieldName.includes('by_pk')) {
      continue
    }

    const typeName = `T${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`

    fileContent += `
export const ${fieldName} = (args: {
  params?: FormattedGraphQLParams<${typeName}>
  project: Array<keyof ${typeName}>
}) => utils.queryWrapper({ name: '${fieldName}', ...args })
`
  }

  return fileContent
}

// Write the generated content to a TypeScript file
function writeToFile(content: string, outputPath: string) {
  fs.writeFileSync(outputPath, content.trim())
  console.log(`Generated TypeScript file at ${outputPath}`)
}

// Main function to generate the TypeScript file
async function main() {
  const endpoint = DEFAULT_GRAPHQL_URL
  const schema = await fetchSchema(endpoint)

  const outputPath = path.join(__dirname, '..', 'build', 'query.ts')
  const fileContent = generateTypeScriptFile(schema)
  writeToFile(fileContent, outputPath)
}

main().catch(console.error)
