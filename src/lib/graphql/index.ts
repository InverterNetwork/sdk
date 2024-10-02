import { subscription } from './build'
import { query } from './build'

export * from './types'
export * from './constants'

const graphql = {
  query,
  subscription,
}

export default graphql
