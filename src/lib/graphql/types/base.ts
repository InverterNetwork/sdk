type GraphQLOperator =
  | '_eq'
  | '_neq'
  | '_gt'
  | '_gte'
  | '_lt'
  | '_lte'
  | '_in'
  | '_nin'
  | '_like'
  | '_nlike'
  | '_ilike'
  | '_nilike'
  | '_is_null'

type WhereCondition<T> = {
  [K in keyof T]?: Partial<Record<GraphQLOperator, any>> | T[K]
}

type OrderByCondition<T> = Partial<
  Record<
    keyof T,
    | 'asc'
    | 'asc_nulls_first'
    | 'asc_nulls_last'
    | 'desc'
    | 'desc_nulls_first'
    | 'desc_nulls_last'
  >
>

export type FormattedGraphQLParams<T extends object> = {
  distinct_on?: string
  limit?: number
  offset?: number
  order_by?: OrderByCondition<T>
  where?: WhereCondition<T>
}
