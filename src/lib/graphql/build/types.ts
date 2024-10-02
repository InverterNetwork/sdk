export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  contract_type: { input: any; output: any }
  entity_type: { input: any; output: any }
  event_type: { input: any; output: any }
  json: { input: any; output: any }
  numeric: { input: any; output: any }
  swaptype: { input: any; output: any }
  timestamp: { input: any; output: any }
  timestamptz: { input: any; output: any }
  vestingstatus: { input: any; output: any }
}

/** columns and relationships of "BondingCurve" */
export type BondingCurve = {
  bcType?: Maybe<Scalars['String']['output']>
  buyFee?: Maybe<Scalars['numeric']['output']>
  buyReserveRatio?: Maybe<Scalars['numeric']['output']>
  chainId: Scalars['Int']['output']
  collateralToken?: Maybe<Scalars['String']['output']>
  collateralTokenDecimals?: Maybe<Scalars['Int']['output']>
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  id: Scalars['String']['output']
  issuanceToken?: Maybe<Scalars['String']['output']>
  issuanceTokenDecimals?: Maybe<Scalars['Int']['output']>
  sellFee?: Maybe<Scalars['numeric']['output']>
  sellReserveRatio?: Maybe<Scalars['numeric']['output']>
  /** An array relationship */
  swaps: Array<Swap>
  virtualCollateral?: Maybe<Scalars['numeric']['output']>
  virtualCollateralRaw?: Maybe<Scalars['numeric']['output']>
  virtualIssuance?: Maybe<Scalars['numeric']['output']>
  /** An object relationship */
  workflow?: Maybe<Workflow>
  workflow_id: Scalars['String']['output']
}

/** columns and relationships of "BondingCurve" */
export type BondingCurveSwapsArgs = {
  distinct_on?: InputMaybe<Array<Swap_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Swap_Order_By>>
  where?: InputMaybe<Swap_Bool_Exp>
}

/** Boolean expression to filter rows from the table "BondingCurve". All fields are combined with a logical 'AND'. */
export type BondingCurve_Bool_Exp = {
  _and?: InputMaybe<Array<BondingCurve_Bool_Exp>>
  _not?: InputMaybe<BondingCurve_Bool_Exp>
  _or?: InputMaybe<Array<BondingCurve_Bool_Exp>>
  bcType?: InputMaybe<String_Comparison_Exp>
  buyFee?: InputMaybe<Numeric_Comparison_Exp>
  buyReserveRatio?: InputMaybe<Numeric_Comparison_Exp>
  chainId?: InputMaybe<Int_Comparison_Exp>
  collateralToken?: InputMaybe<String_Comparison_Exp>
  collateralTokenDecimals?: InputMaybe<Int_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  issuanceToken?: InputMaybe<String_Comparison_Exp>
  issuanceTokenDecimals?: InputMaybe<Int_Comparison_Exp>
  sellFee?: InputMaybe<Numeric_Comparison_Exp>
  sellReserveRatio?: InputMaybe<Numeric_Comparison_Exp>
  swaps?: InputMaybe<Swap_Bool_Exp>
  virtualCollateral?: InputMaybe<Numeric_Comparison_Exp>
  virtualCollateralRaw?: InputMaybe<Numeric_Comparison_Exp>
  virtualIssuance?: InputMaybe<Numeric_Comparison_Exp>
  workflow?: InputMaybe<Workflow_Bool_Exp>
  workflow_id?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "BondingCurve". */
export type BondingCurve_Order_By = {
  bcType?: InputMaybe<Order_By>
  buyFee?: InputMaybe<Order_By>
  buyReserveRatio?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralToken?: InputMaybe<Order_By>
  collateralTokenDecimals?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  issuanceToken?: InputMaybe<Order_By>
  issuanceTokenDecimals?: InputMaybe<Order_By>
  sellFee?: InputMaybe<Order_By>
  sellReserveRatio?: InputMaybe<Order_By>
  swaps_aggregate?: InputMaybe<Swap_Aggregate_Order_By>
  virtualCollateral?: InputMaybe<Order_By>
  virtualCollateralRaw?: InputMaybe<Order_By>
  virtualIssuance?: InputMaybe<Order_By>
  workflow?: InputMaybe<Workflow_Order_By>
  workflow_id?: InputMaybe<Order_By>
}

/** select columns of table "BondingCurve" */
export enum BondingCurve_Select_Column {
  /** column name */
  BcType = 'bcType',
  /** column name */
  BuyFee = 'buyFee',
  /** column name */
  BuyReserveRatio = 'buyReserveRatio',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CollateralToken = 'collateralToken',
  /** column name */
  CollateralTokenDecimals = 'collateralTokenDecimals',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  IssuanceToken = 'issuanceToken',
  /** column name */
  IssuanceTokenDecimals = 'issuanceTokenDecimals',
  /** column name */
  SellFee = 'sellFee',
  /** column name */
  SellReserveRatio = 'sellReserveRatio',
  /** column name */
  VirtualCollateral = 'virtualCollateral',
  /** column name */
  VirtualCollateralRaw = 'virtualCollateralRaw',
  /** column name */
  VirtualIssuance = 'virtualIssuance',
  /** column name */
  WorkflowId = 'workflow_id',
}

/** Streaming cursor of the table "BondingCurve" */
export type BondingCurve_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: BondingCurve_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type BondingCurve_Stream_Cursor_Value_Input = {
  bcType?: InputMaybe<Scalars['String']['input']>
  buyFee?: InputMaybe<Scalars['numeric']['input']>
  buyReserveRatio?: InputMaybe<Scalars['numeric']['input']>
  chainId?: InputMaybe<Scalars['Int']['input']>
  collateralToken?: InputMaybe<Scalars['String']['input']>
  collateralTokenDecimals?: InputMaybe<Scalars['Int']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  issuanceToken?: InputMaybe<Scalars['String']['input']>
  issuanceTokenDecimals?: InputMaybe<Scalars['Int']['input']>
  sellFee?: InputMaybe<Scalars['numeric']['input']>
  sellReserveRatio?: InputMaybe<Scalars['numeric']['input']>
  virtualCollateral?: InputMaybe<Scalars['numeric']['input']>
  virtualCollateralRaw?: InputMaybe<Scalars['numeric']['input']>
  virtualIssuance?: InputMaybe<Scalars['numeric']['input']>
  workflow_id?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>
  _gt?: InputMaybe<Scalars['Boolean']['input']>
  _gte?: InputMaybe<Scalars['Boolean']['input']>
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Boolean']['input']>
  _lte?: InputMaybe<Scalars['Boolean']['input']>
  _neq?: InputMaybe<Scalars['Boolean']['input']>
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>
  _gt?: InputMaybe<Scalars['Int']['input']>
  _gte?: InputMaybe<Scalars['Int']['input']>
  _in?: InputMaybe<Array<Scalars['Int']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Int']['input']>
  _lte?: InputMaybe<Scalars['Int']['input']>
  _neq?: InputMaybe<Scalars['Int']['input']>
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>
}

/** columns and relationships of "LinearVesting" */
export type LinearVesting = {
  amountRaw: Scalars['numeric']['output']
  blockTimestamp: Scalars['Int']['output']
  chainId: Scalars['Int']['output']
  cliff: Scalars['numeric']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  end: Scalars['numeric']['output']
  id: Scalars['String']['output']
  recipient: Scalars['String']['output']
  start: Scalars['numeric']['output']
  status: Scalars['vestingstatus']['output']
  /** An object relationship */
  streamingPaymentProcessor?: Maybe<StreamingPaymentProcessor>
  streamingPaymentProcessor_id: Scalars['String']['output']
  token: Scalars['String']['output']
}

/** order by aggregate values of table "LinearVesting" */
export type LinearVesting_Aggregate_Order_By = {
  avg?: InputMaybe<LinearVesting_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<LinearVesting_Max_Order_By>
  min?: InputMaybe<LinearVesting_Min_Order_By>
  stddev?: InputMaybe<LinearVesting_Stddev_Order_By>
  stddev_pop?: InputMaybe<LinearVesting_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<LinearVesting_Stddev_Samp_Order_By>
  sum?: InputMaybe<LinearVesting_Sum_Order_By>
  var_pop?: InputMaybe<LinearVesting_Var_Pop_Order_By>
  var_samp?: InputMaybe<LinearVesting_Var_Samp_Order_By>
  variance?: InputMaybe<LinearVesting_Variance_Order_By>
}

/** order by avg() on columns of table "LinearVesting" */
export type LinearVesting_Avg_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "LinearVesting". All fields are combined with a logical 'AND'. */
export type LinearVesting_Bool_Exp = {
  _and?: InputMaybe<Array<LinearVesting_Bool_Exp>>
  _not?: InputMaybe<LinearVesting_Bool_Exp>
  _or?: InputMaybe<Array<LinearVesting_Bool_Exp>>
  amountRaw?: InputMaybe<Numeric_Comparison_Exp>
  blockTimestamp?: InputMaybe<Int_Comparison_Exp>
  chainId?: InputMaybe<Int_Comparison_Exp>
  cliff?: InputMaybe<Numeric_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  end?: InputMaybe<Numeric_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  recipient?: InputMaybe<String_Comparison_Exp>
  start?: InputMaybe<Numeric_Comparison_Exp>
  status?: InputMaybe<Vestingstatus_Comparison_Exp>
  streamingPaymentProcessor?: InputMaybe<StreamingPaymentProcessor_Bool_Exp>
  streamingPaymentProcessor_id?: InputMaybe<String_Comparison_Exp>
  token?: InputMaybe<String_Comparison_Exp>
}

/** order by max() on columns of table "LinearVesting" */
export type LinearVesting_Max_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  recipient?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  streamingPaymentProcessor_id?: InputMaybe<Order_By>
  token?: InputMaybe<Order_By>
}

/** order by min() on columns of table "LinearVesting" */
export type LinearVesting_Min_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  recipient?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  streamingPaymentProcessor_id?: InputMaybe<Order_By>
  token?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "LinearVesting". */
export type LinearVesting_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  recipient?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  streamingPaymentProcessor?: InputMaybe<StreamingPaymentProcessor_Order_By>
  streamingPaymentProcessor_id?: InputMaybe<Order_By>
  token?: InputMaybe<Order_By>
}

/** select columns of table "LinearVesting" */
export enum LinearVesting_Select_Column {
  /** column name */
  AmountRaw = 'amountRaw',
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  Cliff = 'cliff',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  End = 'end',
  /** column name */
  Id = 'id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Start = 'start',
  /** column name */
  Status = 'status',
  /** column name */
  StreamingPaymentProcessorId = 'streamingPaymentProcessor_id',
  /** column name */
  Token = 'token',
}

/** order by stddev() on columns of table "LinearVesting" */
export type LinearVesting_Stddev_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** order by stddev_pop() on columns of table "LinearVesting" */
export type LinearVesting_Stddev_Pop_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** order by stddev_samp() on columns of table "LinearVesting" */
export type LinearVesting_Stddev_Samp_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "LinearVesting" */
export type LinearVesting_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: LinearVesting_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type LinearVesting_Stream_Cursor_Value_Input = {
  amountRaw?: InputMaybe<Scalars['numeric']['input']>
  blockTimestamp?: InputMaybe<Scalars['Int']['input']>
  chainId?: InputMaybe<Scalars['Int']['input']>
  cliff?: InputMaybe<Scalars['numeric']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  end?: InputMaybe<Scalars['numeric']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  recipient?: InputMaybe<Scalars['String']['input']>
  start?: InputMaybe<Scalars['numeric']['input']>
  status?: InputMaybe<Scalars['vestingstatus']['input']>
  streamingPaymentProcessor_id?: InputMaybe<Scalars['String']['input']>
  token?: InputMaybe<Scalars['String']['input']>
}

/** order by sum() on columns of table "LinearVesting" */
export type LinearVesting_Sum_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** order by var_pop() on columns of table "LinearVesting" */
export type LinearVesting_Var_Pop_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** order by var_samp() on columns of table "LinearVesting" */
export type LinearVesting_Var_Samp_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** order by variance() on columns of table "LinearVesting" */
export type LinearVesting_Variance_Order_By = {
  amountRaw?: InputMaybe<Order_By>
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  cliff?: InputMaybe<Order_By>
  end?: InputMaybe<Order_By>
  start?: InputMaybe<Order_By>
}

/** columns and relationships of "StreamingPaymentProcessor" */
export type StreamingPaymentProcessor = {
  chainId: Scalars['Int']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  id: Scalars['String']['output']
  /** An array relationship */
  vestings: Array<LinearVesting>
  /** An object relationship */
  workflow?: Maybe<Workflow>
  workflow_id: Scalars['String']['output']
}

/** columns and relationships of "StreamingPaymentProcessor" */
export type StreamingPaymentProcessorVestingsArgs = {
  distinct_on?: InputMaybe<Array<LinearVesting_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<LinearVesting_Order_By>>
  where?: InputMaybe<LinearVesting_Bool_Exp>
}

/** Boolean expression to filter rows from the table "StreamingPaymentProcessor". All fields are combined with a logical 'AND'. */
export type StreamingPaymentProcessor_Bool_Exp = {
  _and?: InputMaybe<Array<StreamingPaymentProcessor_Bool_Exp>>
  _not?: InputMaybe<StreamingPaymentProcessor_Bool_Exp>
  _or?: InputMaybe<Array<StreamingPaymentProcessor_Bool_Exp>>
  chainId?: InputMaybe<Int_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  vestings?: InputMaybe<LinearVesting_Bool_Exp>
  workflow?: InputMaybe<Workflow_Bool_Exp>
  workflow_id?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "StreamingPaymentProcessor". */
export type StreamingPaymentProcessor_Order_By = {
  chainId?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  vestings_aggregate?: InputMaybe<LinearVesting_Aggregate_Order_By>
  workflow?: InputMaybe<Workflow_Order_By>
  workflow_id?: InputMaybe<Order_By>
}

/** select columns of table "StreamingPaymentProcessor" */
export enum StreamingPaymentProcessor_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  WorkflowId = 'workflow_id',
}

/** Streaming cursor of the table "StreamingPaymentProcessor" */
export type StreamingPaymentProcessor_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: StreamingPaymentProcessor_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type StreamingPaymentProcessor_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  workflow_id?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['String']['input']>>
  _eq?: InputMaybe<Array<Scalars['String']['input']>>
  _gt?: InputMaybe<Array<Scalars['String']['input']>>
  _gte?: InputMaybe<Array<Scalars['String']['input']>>
  _in?: InputMaybe<Array<Array<Scalars['String']['input']>>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Array<Scalars['String']['input']>>
  _lte?: InputMaybe<Array<Scalars['String']['input']>>
  _neq?: InputMaybe<Array<Scalars['String']['input']>>
  _nin?: InputMaybe<Array<Array<Scalars['String']['input']>>>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>
  _gt?: InputMaybe<Scalars['String']['input']>
  _gte?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>
  _in?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>
  _lt?: InputMaybe<Scalars['String']['input']>
  _lte?: InputMaybe<Scalars['String']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>
  _nin?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "Swap" */
export type Swap = {
  blockTimestamp: Scalars['Int']['output']
  /** An object relationship */
  bondingCurve?: Maybe<BondingCurve>
  bondingCurve_id: Scalars['String']['output']
  chainId: Scalars['Int']['output']
  collateralAmount: Scalars['numeric']['output']
  collateralToken: Scalars['String']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  id: Scalars['String']['output']
  initiator: Scalars['String']['output']
  issuanceAmount: Scalars['numeric']['output']
  issuanceToken: Scalars['String']['output']
  priceInCol: Scalars['numeric']['output']
  recipient: Scalars['String']['output']
  swapType: Scalars['swaptype']['output']
}

/** order by aggregate values of table "Swap" */
export type Swap_Aggregate_Order_By = {
  avg?: InputMaybe<Swap_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Swap_Max_Order_By>
  min?: InputMaybe<Swap_Min_Order_By>
  stddev?: InputMaybe<Swap_Stddev_Order_By>
  stddev_pop?: InputMaybe<Swap_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Swap_Stddev_Samp_Order_By>
  sum?: InputMaybe<Swap_Sum_Order_By>
  var_pop?: InputMaybe<Swap_Var_Pop_Order_By>
  var_samp?: InputMaybe<Swap_Var_Samp_Order_By>
  variance?: InputMaybe<Swap_Variance_Order_By>
}

/** order by avg() on columns of table "Swap" */
export type Swap_Avg_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "Swap". All fields are combined with a logical 'AND'. */
export type Swap_Bool_Exp = {
  _and?: InputMaybe<Array<Swap_Bool_Exp>>
  _not?: InputMaybe<Swap_Bool_Exp>
  _or?: InputMaybe<Array<Swap_Bool_Exp>>
  blockTimestamp?: InputMaybe<Int_Comparison_Exp>
  bondingCurve?: InputMaybe<BondingCurve_Bool_Exp>
  bondingCurve_id?: InputMaybe<String_Comparison_Exp>
  chainId?: InputMaybe<Int_Comparison_Exp>
  collateralAmount?: InputMaybe<Numeric_Comparison_Exp>
  collateralToken?: InputMaybe<String_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  initiator?: InputMaybe<String_Comparison_Exp>
  issuanceAmount?: InputMaybe<Numeric_Comparison_Exp>
  issuanceToken?: InputMaybe<String_Comparison_Exp>
  priceInCol?: InputMaybe<Numeric_Comparison_Exp>
  recipient?: InputMaybe<String_Comparison_Exp>
  swapType?: InputMaybe<Swaptype_Comparison_Exp>
}

/** order by max() on columns of table "Swap" */
export type Swap_Max_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  bondingCurve_id?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  collateralToken?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  initiator?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  issuanceToken?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
  recipient?: InputMaybe<Order_By>
  swapType?: InputMaybe<Order_By>
}

/** order by min() on columns of table "Swap" */
export type Swap_Min_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  bondingCurve_id?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  collateralToken?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  initiator?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  issuanceToken?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
  recipient?: InputMaybe<Order_By>
  swapType?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "Swap". */
export type Swap_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  bondingCurve?: InputMaybe<BondingCurve_Order_By>
  bondingCurve_id?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  collateralToken?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  initiator?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  issuanceToken?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
  recipient?: InputMaybe<Order_By>
  swapType?: InputMaybe<Order_By>
}

/** select columns of table "Swap" */
export enum Swap_Select_Column {
  /** column name */
  BlockTimestamp = 'blockTimestamp',
  /** column name */
  BondingCurveId = 'bondingCurve_id',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  CollateralAmount = 'collateralAmount',
  /** column name */
  CollateralToken = 'collateralToken',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Initiator = 'initiator',
  /** column name */
  IssuanceAmount = 'issuanceAmount',
  /** column name */
  IssuanceToken = 'issuanceToken',
  /** column name */
  PriceInCol = 'priceInCol',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  SwapType = 'swapType',
}

/** order by stddev() on columns of table "Swap" */
export type Swap_Stddev_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** order by stddev_pop() on columns of table "Swap" */
export type Swap_Stddev_Pop_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** order by stddev_samp() on columns of table "Swap" */
export type Swap_Stddev_Samp_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "Swap" */
export type Swap_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Swap_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Swap_Stream_Cursor_Value_Input = {
  blockTimestamp?: InputMaybe<Scalars['Int']['input']>
  bondingCurve_id?: InputMaybe<Scalars['String']['input']>
  chainId?: InputMaybe<Scalars['Int']['input']>
  collateralAmount?: InputMaybe<Scalars['numeric']['input']>
  collateralToken?: InputMaybe<Scalars['String']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  initiator?: InputMaybe<Scalars['String']['input']>
  issuanceAmount?: InputMaybe<Scalars['numeric']['input']>
  issuanceToken?: InputMaybe<Scalars['String']['input']>
  priceInCol?: InputMaybe<Scalars['numeric']['input']>
  recipient?: InputMaybe<Scalars['String']['input']>
  swapType?: InputMaybe<Scalars['swaptype']['input']>
}

/** order by sum() on columns of table "Swap" */
export type Swap_Sum_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** order by var_pop() on columns of table "Swap" */
export type Swap_Var_Pop_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** order by var_samp() on columns of table "Swap" */
export type Swap_Var_Samp_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** order by variance() on columns of table "Swap" */
export type Swap_Variance_Order_By = {
  blockTimestamp?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  collateralAmount?: InputMaybe<Order_By>
  issuanceAmount?: InputMaybe<Order_By>
  priceInCol?: InputMaybe<Order_By>
}

/** columns and relationships of "Workflow" */
export type Workflow = {
  /** An object relationship */
  authorizer?: Maybe<WorkflowModule>
  authorizer_id: Scalars['String']['output']
  chainId: Scalars['Int']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  /** An object relationship */
  fundingManager?: Maybe<WorkflowModule>
  fundingManager_id: Scalars['String']['output']
  id: Scalars['String']['output']
  optionalModules?: Maybe<Array<Scalars['String']['output']>>
  orchestratorId: Scalars['numeric']['output']
  /** An object relationship */
  paymentProcessor?: Maybe<WorkflowModule>
  paymentProcessor_id: Scalars['String']['output']
}

/** columns and relationships of "WorkflowModule" */
export type WorkflowModule = {
  chainId: Scalars['Int']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  id: Scalars['String']['output']
  /** An object relationship */
  moduleType?: Maybe<WorkflowModuleType>
  moduleType_id: Scalars['String']['output']
  orchestrator: Scalars['String']['output']
}

/** columns and relationships of "WorkflowModuleType" */
export type WorkflowModuleType = {
  beacon: Scalars['String']['output']
  chainId: Scalars['Int']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  id: Scalars['String']['output']
  majorVersion: Scalars['numeric']['output']
  minorVersion: Scalars['numeric']['output']
  name: Scalars['String']['output']
  patchVersion: Scalars['numeric']['output']
  url: Scalars['String']['output']
}

/** Boolean expression to filter rows from the table "WorkflowModuleType". All fields are combined with a logical 'AND'. */
export type WorkflowModuleType_Bool_Exp = {
  _and?: InputMaybe<Array<WorkflowModuleType_Bool_Exp>>
  _not?: InputMaybe<WorkflowModuleType_Bool_Exp>
  _or?: InputMaybe<Array<WorkflowModuleType_Bool_Exp>>
  beacon?: InputMaybe<String_Comparison_Exp>
  chainId?: InputMaybe<Int_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  majorVersion?: InputMaybe<Numeric_Comparison_Exp>
  minorVersion?: InputMaybe<Numeric_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  patchVersion?: InputMaybe<Numeric_Comparison_Exp>
  url?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "WorkflowModuleType". */
export type WorkflowModuleType_Order_By = {
  beacon?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  majorVersion?: InputMaybe<Order_By>
  minorVersion?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  patchVersion?: InputMaybe<Order_By>
  url?: InputMaybe<Order_By>
}

/** select columns of table "WorkflowModuleType" */
export enum WorkflowModuleType_Select_Column {
  /** column name */
  Beacon = 'beacon',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  MajorVersion = 'majorVersion',
  /** column name */
  MinorVersion = 'minorVersion',
  /** column name */
  Name = 'name',
  /** column name */
  PatchVersion = 'patchVersion',
  /** column name */
  Url = 'url',
}

/** Streaming cursor of the table "WorkflowModuleType" */
export type WorkflowModuleType_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: WorkflowModuleType_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type WorkflowModuleType_Stream_Cursor_Value_Input = {
  beacon?: InputMaybe<Scalars['String']['input']>
  chainId?: InputMaybe<Scalars['Int']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  majorVersion?: InputMaybe<Scalars['numeric']['input']>
  minorVersion?: InputMaybe<Scalars['numeric']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  patchVersion?: InputMaybe<Scalars['numeric']['input']>
  url?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "WorkflowModule". All fields are combined with a logical 'AND'. */
export type WorkflowModule_Bool_Exp = {
  _and?: InputMaybe<Array<WorkflowModule_Bool_Exp>>
  _not?: InputMaybe<WorkflowModule_Bool_Exp>
  _or?: InputMaybe<Array<WorkflowModule_Bool_Exp>>
  chainId?: InputMaybe<Int_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  moduleType?: InputMaybe<WorkflowModuleType_Bool_Exp>
  moduleType_id?: InputMaybe<String_Comparison_Exp>
  orchestrator?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "WorkflowModule". */
export type WorkflowModule_Order_By = {
  chainId?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  moduleType?: InputMaybe<WorkflowModuleType_Order_By>
  moduleType_id?: InputMaybe<Order_By>
  orchestrator?: InputMaybe<Order_By>
}

/** select columns of table "WorkflowModule" */
export enum WorkflowModule_Select_Column {
  /** column name */
  ChainId = 'chainId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleTypeId = 'moduleType_id',
  /** column name */
  Orchestrator = 'orchestrator',
}

/** Streaming cursor of the table "WorkflowModule" */
export type WorkflowModule_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: WorkflowModule_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type WorkflowModule_Stream_Cursor_Value_Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  moduleType_id?: InputMaybe<Scalars['String']['input']>
  orchestrator?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "Workflow". All fields are combined with a logical 'AND'. */
export type Workflow_Bool_Exp = {
  _and?: InputMaybe<Array<Workflow_Bool_Exp>>
  _not?: InputMaybe<Workflow_Bool_Exp>
  _or?: InputMaybe<Array<Workflow_Bool_Exp>>
  authorizer?: InputMaybe<WorkflowModule_Bool_Exp>
  authorizer_id?: InputMaybe<String_Comparison_Exp>
  chainId?: InputMaybe<Int_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  fundingManager?: InputMaybe<WorkflowModule_Bool_Exp>
  fundingManager_id?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<String_Comparison_Exp>
  optionalModules?: InputMaybe<String_Array_Comparison_Exp>
  orchestratorId?: InputMaybe<Numeric_Comparison_Exp>
  paymentProcessor?: InputMaybe<WorkflowModule_Bool_Exp>
  paymentProcessor_id?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "Workflow". */
export type Workflow_Order_By = {
  authorizer?: InputMaybe<WorkflowModule_Order_By>
  authorizer_id?: InputMaybe<Order_By>
  chainId?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  fundingManager?: InputMaybe<WorkflowModule_Order_By>
  fundingManager_id?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  optionalModules?: InputMaybe<Order_By>
  orchestratorId?: InputMaybe<Order_By>
  paymentProcessor?: InputMaybe<WorkflowModule_Order_By>
  paymentProcessor_id?: InputMaybe<Order_By>
}

/** select columns of table "Workflow" */
export enum Workflow_Select_Column {
  /** column name */
  AuthorizerId = 'authorizer_id',
  /** column name */
  ChainId = 'chainId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  FundingManagerId = 'fundingManager_id',
  /** column name */
  Id = 'id',
  /** column name */
  OptionalModules = 'optionalModules',
  /** column name */
  OrchestratorId = 'orchestratorId',
  /** column name */
  PaymentProcessorId = 'paymentProcessor_id',
}

/** Streaming cursor of the table "Workflow" */
export type Workflow_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Workflow_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Workflow_Stream_Cursor_Value_Input = {
  authorizer_id?: InputMaybe<Scalars['String']['input']>
  chainId?: InputMaybe<Scalars['Int']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  fundingManager_id?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  optionalModules?: InputMaybe<Array<Scalars['String']['input']>>
  orchestratorId?: InputMaybe<Scalars['numeric']['input']>
  paymentProcessor_id?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "chain_metadata" */
export type Chain_Metadata = {
  block_height: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
  end_block?: Maybe<Scalars['Int']['output']>
  first_event_block_number?: Maybe<Scalars['Int']['output']>
  is_hyper_sync: Scalars['Boolean']['output']
  latest_fetched_block_number: Scalars['Int']['output']
  latest_processed_block?: Maybe<Scalars['Int']['output']>
  num_batches_fetched: Scalars['Int']['output']
  num_events_processed?: Maybe<Scalars['Int']['output']>
  start_block: Scalars['Int']['output']
  timestamp_caught_up_to_head_or_endblock?: Maybe<
    Scalars['timestamptz']['output']
  >
}

/** Boolean expression to filter rows from the table "chain_metadata". All fields are combined with a logical 'AND'. */
export type Chain_Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>
  _not?: InputMaybe<Chain_Metadata_Bool_Exp>
  _or?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>
  block_height?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
  end_block?: InputMaybe<Int_Comparison_Exp>
  first_event_block_number?: InputMaybe<Int_Comparison_Exp>
  is_hyper_sync?: InputMaybe<Boolean_Comparison_Exp>
  latest_fetched_block_number?: InputMaybe<Int_Comparison_Exp>
  latest_processed_block?: InputMaybe<Int_Comparison_Exp>
  num_batches_fetched?: InputMaybe<Int_Comparison_Exp>
  num_events_processed?: InputMaybe<Int_Comparison_Exp>
  start_block?: InputMaybe<Int_Comparison_Exp>
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Timestamptz_Comparison_Exp>
}

/** Ordering options when selecting data from "chain_metadata". */
export type Chain_Metadata_Order_By = {
  block_height?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  end_block?: InputMaybe<Order_By>
  first_event_block_number?: InputMaybe<Order_By>
  is_hyper_sync?: InputMaybe<Order_By>
  latest_fetched_block_number?: InputMaybe<Order_By>
  latest_processed_block?: InputMaybe<Order_By>
  num_batches_fetched?: InputMaybe<Order_By>
  num_events_processed?: InputMaybe<Order_By>
  start_block?: InputMaybe<Order_By>
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Order_By>
}

/** select columns of table "chain_metadata" */
export enum Chain_Metadata_Select_Column {
  /** column name */
  BlockHeight = 'block_height',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EndBlock = 'end_block',
  /** column name */
  FirstEventBlockNumber = 'first_event_block_number',
  /** column name */
  IsHyperSync = 'is_hyper_sync',
  /** column name */
  LatestFetchedBlockNumber = 'latest_fetched_block_number',
  /** column name */
  LatestProcessedBlock = 'latest_processed_block',
  /** column name */
  NumBatchesFetched = 'num_batches_fetched',
  /** column name */
  NumEventsProcessed = 'num_events_processed',
  /** column name */
  StartBlock = 'start_block',
  /** column name */
  TimestampCaughtUpToHeadOrEndblock = 'timestamp_caught_up_to_head_or_endblock',
}

/** Streaming cursor of the table "chain_metadata" */
export type Chain_Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Chain_Metadata_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Chain_Metadata_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
  end_block?: InputMaybe<Scalars['Int']['input']>
  first_event_block_number?: InputMaybe<Scalars['Int']['input']>
  is_hyper_sync?: InputMaybe<Scalars['Boolean']['input']>
  latest_fetched_block_number?: InputMaybe<Scalars['Int']['input']>
  latest_processed_block?: InputMaybe<Scalars['Int']['input']>
  num_batches_fetched?: InputMaybe<Scalars['Int']['input']>
  num_events_processed?: InputMaybe<Scalars['Int']['input']>
  start_block?: InputMaybe<Scalars['Int']['input']>
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<
    Scalars['timestamptz']['input']
  >
}

/** Boolean expression to compare columns of type "contract_type". All fields are combined with logical 'AND'. */
export type Contract_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['contract_type']['input']>
  _gt?: InputMaybe<Scalars['contract_type']['input']>
  _gte?: InputMaybe<Scalars['contract_type']['input']>
  _in?: InputMaybe<Array<Scalars['contract_type']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['contract_type']['input']>
  _lte?: InputMaybe<Scalars['contract_type']['input']>
  _neq?: InputMaybe<Scalars['contract_type']['input']>
  _nin?: InputMaybe<Array<Scalars['contract_type']['input']>>
}

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** columns and relationships of "dynamic_contract_registry" */
export type Dynamic_Contract_Registry = {
  block_timestamp: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
  contract_address: Scalars['String']['output']
  contract_type: Scalars['contract_type']['output']
  event_id: Scalars['numeric']['output']
}

/** Boolean expression to filter rows from the table "dynamic_contract_registry". All fields are combined with a logical 'AND'. */
export type Dynamic_Contract_Registry_Bool_Exp = {
  _and?: InputMaybe<Array<Dynamic_Contract_Registry_Bool_Exp>>
  _not?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>
  _or?: InputMaybe<Array<Dynamic_Contract_Registry_Bool_Exp>>
  block_timestamp?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
  contract_address?: InputMaybe<String_Comparison_Exp>
  contract_type?: InputMaybe<Contract_Type_Comparison_Exp>
  event_id?: InputMaybe<Numeric_Comparison_Exp>
}

/** Ordering options when selecting data from "dynamic_contract_registry". */
export type Dynamic_Contract_Registry_Order_By = {
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  contract_address?: InputMaybe<Order_By>
  contract_type?: InputMaybe<Order_By>
  event_id?: InputMaybe<Order_By>
}

/** select columns of table "dynamic_contract_registry" */
export enum Dynamic_Contract_Registry_Select_Column {
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractType = 'contract_type',
  /** column name */
  EventId = 'event_id',
}

/** Streaming cursor of the table "dynamic_contract_registry" */
export type Dynamic_Contract_Registry_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dynamic_Contract_Registry_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Dynamic_Contract_Registry_Stream_Cursor_Value_Input = {
  block_timestamp?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
  contract_address?: InputMaybe<Scalars['String']['input']>
  contract_type?: InputMaybe<Scalars['contract_type']['input']>
  event_id?: InputMaybe<Scalars['numeric']['input']>
}

/** columns and relationships of "end_of_block_range_scanned_data" */
export type End_Of_Block_Range_Scanned_Data = {
  block_hash: Scalars['String']['output']
  block_number: Scalars['Int']['output']
  block_timestamp: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
}

/** Boolean expression to filter rows from the table "end_of_block_range_scanned_data". All fields are combined with a logical 'AND'. */
export type End_Of_Block_Range_Scanned_Data_Bool_Exp = {
  _and?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Bool_Exp>>
  _not?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>
  _or?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Bool_Exp>>
  block_hash?: InputMaybe<String_Comparison_Exp>
  block_number?: InputMaybe<Int_Comparison_Exp>
  block_timestamp?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
}

/** Ordering options when selecting data from "end_of_block_range_scanned_data". */
export type End_Of_Block_Range_Scanned_Data_Order_By = {
  block_hash?: InputMaybe<Order_By>
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
}

/** select columns of table "end_of_block_range_scanned_data" */
export enum End_Of_Block_Range_Scanned_Data_Select_Column {
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
}

/** Streaming cursor of the table "end_of_block_range_scanned_data" */
export type End_Of_Block_Range_Scanned_Data_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: End_Of_Block_Range_Scanned_Data_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type End_Of_Block_Range_Scanned_Data_Stream_Cursor_Value_Input = {
  block_hash?: InputMaybe<Scalars['String']['input']>
  block_number?: InputMaybe<Scalars['Int']['input']>
  block_timestamp?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
}

/** columns and relationships of "entity_history" */
export type Entity_History = {
  block_number: Scalars['Int']['output']
  block_timestamp: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
  entity_id: Scalars['String']['output']
  entity_type: Scalars['entity_type']['output']
  /** An object relationship */
  event?: Maybe<Raw_Events>
  log_index: Scalars['Int']['output']
  params?: Maybe<Scalars['json']['output']>
  previous_block_number?: Maybe<Scalars['Int']['output']>
  previous_block_timestamp?: Maybe<Scalars['Int']['output']>
  previous_chain_id?: Maybe<Scalars['Int']['output']>
  previous_log_index?: Maybe<Scalars['Int']['output']>
}

/** columns and relationships of "entity_history" */
export type Entity_HistoryParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** order by aggregate values of table "entity_history" */
export type Entity_History_Aggregate_Order_By = {
  avg?: InputMaybe<Entity_History_Avg_Order_By>
  count?: InputMaybe<Order_By>
  max?: InputMaybe<Entity_History_Max_Order_By>
  min?: InputMaybe<Entity_History_Min_Order_By>
  stddev?: InputMaybe<Entity_History_Stddev_Order_By>
  stddev_pop?: InputMaybe<Entity_History_Stddev_Pop_Order_By>
  stddev_samp?: InputMaybe<Entity_History_Stddev_Samp_Order_By>
  sum?: InputMaybe<Entity_History_Sum_Order_By>
  var_pop?: InputMaybe<Entity_History_Var_Pop_Order_By>
  var_samp?: InputMaybe<Entity_History_Var_Samp_Order_By>
  variance?: InputMaybe<Entity_History_Variance_Order_By>
}

/** order by avg() on columns of table "entity_history" */
export type Entity_History_Avg_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** Boolean expression to filter rows from the table "entity_history". All fields are combined with a logical 'AND'. */
export type Entity_History_Bool_Exp = {
  _and?: InputMaybe<Array<Entity_History_Bool_Exp>>
  _not?: InputMaybe<Entity_History_Bool_Exp>
  _or?: InputMaybe<Array<Entity_History_Bool_Exp>>
  block_number?: InputMaybe<Int_Comparison_Exp>
  block_timestamp?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
  entity_id?: InputMaybe<String_Comparison_Exp>
  entity_type?: InputMaybe<Entity_Type_Comparison_Exp>
  event?: InputMaybe<Raw_Events_Bool_Exp>
  log_index?: InputMaybe<Int_Comparison_Exp>
  params?: InputMaybe<Json_Comparison_Exp>
  previous_block_number?: InputMaybe<Int_Comparison_Exp>
  previous_block_timestamp?: InputMaybe<Int_Comparison_Exp>
  previous_chain_id?: InputMaybe<Int_Comparison_Exp>
  previous_log_index?: InputMaybe<Int_Comparison_Exp>
}

/** columns and relationships of "entity_history_filter" */
export type Entity_History_Filter = {
  block_number: Scalars['Int']['output']
  block_timestamp: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
  entity_id: Scalars['String']['output']
  entity_type: Scalars['entity_type']['output']
  /** An object relationship */
  event?: Maybe<Raw_Events>
  log_index: Scalars['Int']['output']
  new_val?: Maybe<Scalars['json']['output']>
  old_val?: Maybe<Scalars['json']['output']>
  previous_block_number?: Maybe<Scalars['Int']['output']>
  previous_log_index: Scalars['Int']['output']
}

/** columns and relationships of "entity_history_filter" */
export type Entity_History_FilterNew_ValArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "entity_history_filter" */
export type Entity_History_FilterOld_ValArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "entity_history_filter". All fields are combined with a logical 'AND'. */
export type Entity_History_Filter_Bool_Exp = {
  _and?: InputMaybe<Array<Entity_History_Filter_Bool_Exp>>
  _not?: InputMaybe<Entity_History_Filter_Bool_Exp>
  _or?: InputMaybe<Array<Entity_History_Filter_Bool_Exp>>
  block_number?: InputMaybe<Int_Comparison_Exp>
  block_timestamp?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
  entity_id?: InputMaybe<String_Comparison_Exp>
  entity_type?: InputMaybe<Entity_Type_Comparison_Exp>
  event?: InputMaybe<Raw_Events_Bool_Exp>
  log_index?: InputMaybe<Int_Comparison_Exp>
  new_val?: InputMaybe<Json_Comparison_Exp>
  old_val?: InputMaybe<Json_Comparison_Exp>
  previous_block_number?: InputMaybe<Int_Comparison_Exp>
  previous_log_index?: InputMaybe<Int_Comparison_Exp>
}

/** Ordering options when selecting data from "entity_history_filter". */
export type Entity_History_Filter_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  entity_id?: InputMaybe<Order_By>
  entity_type?: InputMaybe<Order_By>
  event?: InputMaybe<Raw_Events_Order_By>
  log_index?: InputMaybe<Order_By>
  new_val?: InputMaybe<Order_By>
  old_val?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** select columns of table "entity_history_filter" */
export enum Entity_History_Filter_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  NewVal = 'new_val',
  /** column name */
  OldVal = 'old_val',
  /** column name */
  PreviousBlockNumber = 'previous_block_number',
  /** column name */
  PreviousLogIndex = 'previous_log_index',
}

/** Streaming cursor of the table "entity_history_filter" */
export type Entity_History_Filter_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Entity_History_Filter_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Entity_History_Filter_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>
  block_timestamp?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
  entity_id?: InputMaybe<Scalars['String']['input']>
  entity_type?: InputMaybe<Scalars['entity_type']['input']>
  log_index?: InputMaybe<Scalars['Int']['input']>
  new_val?: InputMaybe<Scalars['json']['input']>
  old_val?: InputMaybe<Scalars['json']['input']>
  previous_block_number?: InputMaybe<Scalars['Int']['input']>
  previous_log_index?: InputMaybe<Scalars['Int']['input']>
}

/** order by max() on columns of table "entity_history" */
export type Entity_History_Max_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  entity_id?: InputMaybe<Order_By>
  entity_type?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** order by min() on columns of table "entity_history" */
export type Entity_History_Min_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  entity_id?: InputMaybe<Order_By>
  entity_type?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** Ordering options when selecting data from "entity_history". */
export type Entity_History_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  entity_id?: InputMaybe<Order_By>
  entity_type?: InputMaybe<Order_By>
  event?: InputMaybe<Raw_Events_Order_By>
  log_index?: InputMaybe<Order_By>
  params?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** select columns of table "entity_history" */
export enum Entity_History_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  PreviousBlockNumber = 'previous_block_number',
  /** column name */
  PreviousBlockTimestamp = 'previous_block_timestamp',
  /** column name */
  PreviousChainId = 'previous_chain_id',
  /** column name */
  PreviousLogIndex = 'previous_log_index',
}

/** order by stddev() on columns of table "entity_history" */
export type Entity_History_Stddev_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** order by stddev_pop() on columns of table "entity_history" */
export type Entity_History_Stddev_Pop_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** order by stddev_samp() on columns of table "entity_history" */
export type Entity_History_Stddev_Samp_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** Streaming cursor of the table "entity_history" */
export type Entity_History_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Entity_History_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Entity_History_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>
  block_timestamp?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
  entity_id?: InputMaybe<Scalars['String']['input']>
  entity_type?: InputMaybe<Scalars['entity_type']['input']>
  log_index?: InputMaybe<Scalars['Int']['input']>
  params?: InputMaybe<Scalars['json']['input']>
  previous_block_number?: InputMaybe<Scalars['Int']['input']>
  previous_block_timestamp?: InputMaybe<Scalars['Int']['input']>
  previous_chain_id?: InputMaybe<Scalars['Int']['input']>
  previous_log_index?: InputMaybe<Scalars['Int']['input']>
}

/** order by sum() on columns of table "entity_history" */
export type Entity_History_Sum_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** order by var_pop() on columns of table "entity_history" */
export type Entity_History_Var_Pop_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** order by var_samp() on columns of table "entity_history" */
export type Entity_History_Var_Samp_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** order by variance() on columns of table "entity_history" */
export type Entity_History_Variance_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  previous_block_number?: InputMaybe<Order_By>
  previous_block_timestamp?: InputMaybe<Order_By>
  previous_chain_id?: InputMaybe<Order_By>
  previous_log_index?: InputMaybe<Order_By>
}

/** Boolean expression to compare columns of type "entity_type". All fields are combined with logical 'AND'. */
export type Entity_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['entity_type']['input']>
  _gt?: InputMaybe<Scalars['entity_type']['input']>
  _gte?: InputMaybe<Scalars['entity_type']['input']>
  _in?: InputMaybe<Array<Scalars['entity_type']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['entity_type']['input']>
  _lte?: InputMaybe<Scalars['entity_type']['input']>
  _neq?: InputMaybe<Scalars['entity_type']['input']>
  _nin?: InputMaybe<Array<Scalars['entity_type']['input']>>
}

/** columns and relationships of "event_sync_state" */
export type Event_Sync_State = {
  block_number: Scalars['Int']['output']
  block_timestamp: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
  log_index: Scalars['Int']['output']
  transaction_index: Scalars['Int']['output']
}

/** Boolean expression to filter rows from the table "event_sync_state". All fields are combined with a logical 'AND'. */
export type Event_Sync_State_Bool_Exp = {
  _and?: InputMaybe<Array<Event_Sync_State_Bool_Exp>>
  _not?: InputMaybe<Event_Sync_State_Bool_Exp>
  _or?: InputMaybe<Array<Event_Sync_State_Bool_Exp>>
  block_number?: InputMaybe<Int_Comparison_Exp>
  block_timestamp?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
  log_index?: InputMaybe<Int_Comparison_Exp>
  transaction_index?: InputMaybe<Int_Comparison_Exp>
}

/** Ordering options when selecting data from "event_sync_state". */
export type Event_Sync_State_Order_By = {
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  transaction_index?: InputMaybe<Order_By>
}

/** select columns of table "event_sync_state" */
export enum Event_Sync_State_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  TransactionIndex = 'transaction_index',
}

/** Streaming cursor of the table "event_sync_state" */
export type Event_Sync_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Event_Sync_State_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Event_Sync_State_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>
  block_timestamp?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
  log_index?: InputMaybe<Scalars['Int']['input']>
  transaction_index?: InputMaybe<Scalars['Int']['input']>
}

/** Boolean expression to compare columns of type "event_type". All fields are combined with logical 'AND'. */
export type Event_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['event_type']['input']>
  _gt?: InputMaybe<Scalars['event_type']['input']>
  _gte?: InputMaybe<Scalars['event_type']['input']>
  _in?: InputMaybe<Array<Scalars['event_type']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['event_type']['input']>
  _lte?: InputMaybe<Scalars['event_type']['input']>
  _neq?: InputMaybe<Scalars['event_type']['input']>
  _nin?: InputMaybe<Array<Scalars['event_type']['input']>>
}

export type Get_Entity_History_Filter_Args = {
  end_block?: InputMaybe<Scalars['Int']['input']>
  end_chain_id?: InputMaybe<Scalars['Int']['input']>
  end_log_index?: InputMaybe<Scalars['Int']['input']>
  end_timestamp?: InputMaybe<Scalars['Int']['input']>
  start_block?: InputMaybe<Scalars['Int']['input']>
  start_chain_id?: InputMaybe<Scalars['Int']['input']>
  start_log_index?: InputMaybe<Scalars['Int']['input']>
  start_timestamp?: InputMaybe<Scalars['Int']['input']>
}

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']['input']>
  _gt?: InputMaybe<Scalars['json']['input']>
  _gte?: InputMaybe<Scalars['json']['input']>
  _in?: InputMaybe<Array<Scalars['json']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['json']['input']>
  _lte?: InputMaybe<Scalars['json']['input']>
  _neq?: InputMaybe<Scalars['json']['input']>
  _nin?: InputMaybe<Array<Scalars['json']['input']>>
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>
  _gt?: InputMaybe<Scalars['numeric']['input']>
  _gte?: InputMaybe<Scalars['numeric']['input']>
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['numeric']['input']>
  _lte?: InputMaybe<Scalars['numeric']['input']>
  _neq?: InputMaybe<Scalars['numeric']['input']>
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>
}

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** columns and relationships of "persisted_state" */
export type Persisted_State = {
  abi_files_hash: Scalars['String']['output']
  config_hash: Scalars['String']['output']
  envio_version: Scalars['String']['output']
  handler_files_hash: Scalars['String']['output']
  id: Scalars['Int']['output']
  schema_hash: Scalars['String']['output']
}

/** Boolean expression to filter rows from the table "persisted_state". All fields are combined with a logical 'AND'. */
export type Persisted_State_Bool_Exp = {
  _and?: InputMaybe<Array<Persisted_State_Bool_Exp>>
  _not?: InputMaybe<Persisted_State_Bool_Exp>
  _or?: InputMaybe<Array<Persisted_State_Bool_Exp>>
  abi_files_hash?: InputMaybe<String_Comparison_Exp>
  config_hash?: InputMaybe<String_Comparison_Exp>
  envio_version?: InputMaybe<String_Comparison_Exp>
  handler_files_hash?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Int_Comparison_Exp>
  schema_hash?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "persisted_state". */
export type Persisted_State_Order_By = {
  abi_files_hash?: InputMaybe<Order_By>
  config_hash?: InputMaybe<Order_By>
  envio_version?: InputMaybe<Order_By>
  handler_files_hash?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  schema_hash?: InputMaybe<Order_By>
}

/** select columns of table "persisted_state" */
export enum Persisted_State_Select_Column {
  /** column name */
  AbiFilesHash = 'abi_files_hash',
  /** column name */
  ConfigHash = 'config_hash',
  /** column name */
  EnvioVersion = 'envio_version',
  /** column name */
  HandlerFilesHash = 'handler_files_hash',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaHash = 'schema_hash',
}

/** Streaming cursor of the table "persisted_state" */
export type Persisted_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Persisted_State_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Persisted_State_Stream_Cursor_Value_Input = {
  abi_files_hash?: InputMaybe<Scalars['String']['input']>
  config_hash?: InputMaybe<Scalars['String']['input']>
  envio_version?: InputMaybe<Scalars['String']['input']>
  handler_files_hash?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  schema_hash?: InputMaybe<Scalars['String']['input']>
}

export type Query_Root = {
  /** fetch data from the table: "BondingCurve" */
  BondingCurve: Array<BondingCurve>
  /** fetch data from the table: "BondingCurve" using primary key columns */
  BondingCurve_by_pk?: Maybe<BondingCurve>
  /** fetch data from the table: "LinearVesting" */
  LinearVesting: Array<LinearVesting>
  /** fetch data from the table: "LinearVesting" using primary key columns */
  LinearVesting_by_pk?: Maybe<LinearVesting>
  /** fetch data from the table: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor: Array<StreamingPaymentProcessor>
  /** fetch data from the table: "StreamingPaymentProcessor" using primary key columns */
  StreamingPaymentProcessor_by_pk?: Maybe<StreamingPaymentProcessor>
  /** fetch data from the table: "Swap" */
  Swap: Array<Swap>
  /** fetch data from the table: "Swap" using primary key columns */
  Swap_by_pk?: Maybe<Swap>
  /** fetch data from the table: "Workflow" */
  Workflow: Array<Workflow>
  /** fetch data from the table: "WorkflowModule" */
  WorkflowModule: Array<WorkflowModule>
  /** fetch data from the table: "WorkflowModuleType" */
  WorkflowModuleType: Array<WorkflowModuleType>
  /** fetch data from the table: "WorkflowModuleType" using primary key columns */
  WorkflowModuleType_by_pk?: Maybe<WorkflowModuleType>
  /** fetch data from the table: "WorkflowModule" using primary key columns */
  WorkflowModule_by_pk?: Maybe<WorkflowModule>
  /** fetch data from the table: "Workflow" using primary key columns */
  Workflow_by_pk?: Maybe<Workflow>
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: Maybe<Chain_Metadata>
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<Dynamic_Contract_Registry>
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<Dynamic_Contract_Registry>
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: Array<End_Of_Block_Range_Scanned_Data>
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: Maybe<End_Of_Block_Range_Scanned_Data>
  /** fetch data from the table: "entity_history" */
  entity_history: Array<Entity_History>
  /** fetch data from the table: "entity_history" using primary key columns */
  entity_history_by_pk?: Maybe<Entity_History>
  /** fetch data from the table: "entity_history_filter" */
  entity_history_filter: Array<Entity_History_Filter>
  /** fetch data from the table: "entity_history_filter" using primary key columns */
  entity_history_filter_by_pk?: Maybe<Entity_History_Filter>
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: Array<Event_Sync_State>
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: Maybe<Event_Sync_State>
  /** This function helps search for articles */
  get_entity_history_filter: Array<Entity_History_Filter>
  /** fetch data from the table: "persisted_state" */
  persisted_state: Array<Persisted_State>
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: Maybe<Persisted_State>
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>
}

export type Query_RootBondingCurveArgs = {
  distinct_on?: InputMaybe<Array<BondingCurve_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<BondingCurve_Order_By>>
  where?: InputMaybe<BondingCurve_Bool_Exp>
}

export type Query_RootBondingCurve_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootLinearVestingArgs = {
  distinct_on?: InputMaybe<Array<LinearVesting_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<LinearVesting_Order_By>>
  where?: InputMaybe<LinearVesting_Bool_Exp>
}

export type Query_RootLinearVesting_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootStreamingPaymentProcessorArgs = {
  distinct_on?: InputMaybe<Array<StreamingPaymentProcessor_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<StreamingPaymentProcessor_Order_By>>
  where?: InputMaybe<StreamingPaymentProcessor_Bool_Exp>
}

export type Query_RootStreamingPaymentProcessor_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootSwapArgs = {
  distinct_on?: InputMaybe<Array<Swap_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Swap_Order_By>>
  where?: InputMaybe<Swap_Bool_Exp>
}

export type Query_RootSwap_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootWorkflowArgs = {
  distinct_on?: InputMaybe<Array<Workflow_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Workflow_Order_By>>
  where?: InputMaybe<Workflow_Bool_Exp>
}

export type Query_RootWorkflowModuleArgs = {
  distinct_on?: InputMaybe<Array<WorkflowModule_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<WorkflowModule_Order_By>>
  where?: InputMaybe<WorkflowModule_Bool_Exp>
}

export type Query_RootWorkflowModuleTypeArgs = {
  distinct_on?: InputMaybe<Array<WorkflowModuleType_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<WorkflowModuleType_Order_By>>
  where?: InputMaybe<WorkflowModuleType_Bool_Exp>
}

export type Query_RootWorkflowModuleType_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootWorkflowModule_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootWorkflow_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Query_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>
  where?: InputMaybe<Chain_Metadata_Bool_Exp>
}

export type Query_RootChain_Metadata_By_PkArgs = {
  chain_id: Scalars['Int']['input']
}

export type Query_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<Dynamic_Contract_Registry_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Dynamic_Contract_Registry_Order_By>>
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>
}

export type Query_RootDynamic_Contract_Registry_By_PkArgs = {
  chain_id: Scalars['Int']['input']
  contract_address: Scalars['String']['input']
}

export type Query_RootEnd_Of_Block_Range_Scanned_DataArgs = {
  distinct_on?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Order_By>>
  where?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>
}

export type Query_RootEnd_Of_Block_Range_Scanned_Data_By_PkArgs = {
  block_number: Scalars['Int']['input']
  chain_id: Scalars['Int']['input']
}

export type Query_RootEntity_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Entity_History_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Order_By>>
  where?: InputMaybe<Entity_History_Bool_Exp>
}

export type Query_RootEntity_History_By_PkArgs = {
  block_number: Scalars['Int']['input']
  block_timestamp: Scalars['Int']['input']
  chain_id: Scalars['Int']['input']
  entity_id: Scalars['String']['input']
  entity_type: Scalars['entity_type']['input']
  log_index: Scalars['Int']['input']
}

export type Query_RootEntity_History_FilterArgs = {
  distinct_on?: InputMaybe<Array<Entity_History_Filter_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Filter_Order_By>>
  where?: InputMaybe<Entity_History_Filter_Bool_Exp>
}

export type Query_RootEntity_History_Filter_By_PkArgs = {
  block_number: Scalars['Int']['input']
  block_timestamp: Scalars['Int']['input']
  chain_id: Scalars['Int']['input']
  entity_id: Scalars['String']['input']
  entity_type: Scalars['entity_type']['input']
  log_index: Scalars['Int']['input']
  previous_log_index: Scalars['Int']['input']
}

export type Query_RootEvent_Sync_StateArgs = {
  distinct_on?: InputMaybe<Array<Event_Sync_State_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Event_Sync_State_Order_By>>
  where?: InputMaybe<Event_Sync_State_Bool_Exp>
}

export type Query_RootEvent_Sync_State_By_PkArgs = {
  chain_id: Scalars['Int']['input']
}

export type Query_RootGet_Entity_History_FilterArgs = {
  args: Get_Entity_History_Filter_Args
  distinct_on?: InputMaybe<Array<Entity_History_Filter_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Filter_Order_By>>
  where?: InputMaybe<Entity_History_Filter_Bool_Exp>
}

export type Query_RootPersisted_StateArgs = {
  distinct_on?: InputMaybe<Array<Persisted_State_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Persisted_State_Order_By>>
  where?: InputMaybe<Persisted_State_Bool_Exp>
}

export type Query_RootPersisted_State_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Query_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>
  where?: InputMaybe<Raw_Events_Bool_Exp>
}

export type Query_RootRaw_Events_By_PkArgs = {
  chain_id: Scalars['Int']['input']
  event_id: Scalars['numeric']['input']
}

/** columns and relationships of "raw_events" */
export type Raw_Events = {
  block_hash: Scalars['String']['output']
  block_number: Scalars['Int']['output']
  block_timestamp: Scalars['Int']['output']
  chain_id: Scalars['Int']['output']
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>
  /** An array relationship */
  event_history: Array<Entity_History>
  event_id: Scalars['numeric']['output']
  event_type: Scalars['event_type']['output']
  log_index: Scalars['Int']['output']
  params: Scalars['json']['output']
  src_address: Scalars['String']['output']
  transaction_hash: Scalars['String']['output']
  transaction_index: Scalars['Int']['output']
}

/** columns and relationships of "raw_events" */
export type Raw_EventsEvent_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Entity_History_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Order_By>>
  where?: InputMaybe<Entity_History_Bool_Exp>
}

/** columns and relationships of "raw_events" */
export type Raw_EventsParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export type Raw_Events_Bool_Exp = {
  _and?: InputMaybe<Array<Raw_Events_Bool_Exp>>
  _not?: InputMaybe<Raw_Events_Bool_Exp>
  _or?: InputMaybe<Array<Raw_Events_Bool_Exp>>
  block_hash?: InputMaybe<String_Comparison_Exp>
  block_number?: InputMaybe<Int_Comparison_Exp>
  block_timestamp?: InputMaybe<Int_Comparison_Exp>
  chain_id?: InputMaybe<Int_Comparison_Exp>
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>
  event_history?: InputMaybe<Entity_History_Bool_Exp>
  event_id?: InputMaybe<Numeric_Comparison_Exp>
  event_type?: InputMaybe<Event_Type_Comparison_Exp>
  log_index?: InputMaybe<Int_Comparison_Exp>
  params?: InputMaybe<Json_Comparison_Exp>
  src_address?: InputMaybe<String_Comparison_Exp>
  transaction_hash?: InputMaybe<String_Comparison_Exp>
  transaction_index?: InputMaybe<Int_Comparison_Exp>
}

/** Ordering options when selecting data from "raw_events". */
export type Raw_Events_Order_By = {
  block_hash?: InputMaybe<Order_By>
  block_number?: InputMaybe<Order_By>
  block_timestamp?: InputMaybe<Order_By>
  chain_id?: InputMaybe<Order_By>
  db_write_timestamp?: InputMaybe<Order_By>
  event_history_aggregate?: InputMaybe<Entity_History_Aggregate_Order_By>
  event_id?: InputMaybe<Order_By>
  event_type?: InputMaybe<Order_By>
  log_index?: InputMaybe<Order_By>
  params?: InputMaybe<Order_By>
  src_address?: InputMaybe<Order_By>
  transaction_hash?: InputMaybe<Order_By>
  transaction_index?: InputMaybe<Order_By>
}

/** select columns of table "raw_events" */
export enum Raw_Events_Select_Column {
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventId = 'event_id',
  /** column name */
  EventType = 'event_type',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  SrcAddress = 'src_address',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  TransactionIndex = 'transaction_index',
}

/** Streaming cursor of the table "raw_events" */
export type Raw_Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Raw_Events_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Raw_Events_Stream_Cursor_Value_Input = {
  block_hash?: InputMaybe<Scalars['String']['input']>
  block_number?: InputMaybe<Scalars['Int']['input']>
  block_timestamp?: InputMaybe<Scalars['Int']['input']>
  chain_id?: InputMaybe<Scalars['Int']['input']>
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>
  event_id?: InputMaybe<Scalars['numeric']['input']>
  event_type?: InputMaybe<Scalars['event_type']['input']>
  log_index?: InputMaybe<Scalars['Int']['input']>
  params?: InputMaybe<Scalars['json']['input']>
  src_address?: InputMaybe<Scalars['String']['input']>
  transaction_hash?: InputMaybe<Scalars['String']['input']>
  transaction_index?: InputMaybe<Scalars['Int']['input']>
}

export type Subscription_Root = {
  /** fetch data from the table: "BondingCurve" */
  BondingCurve: Array<BondingCurve>
  /** fetch data from the table: "BondingCurve" using primary key columns */
  BondingCurve_by_pk?: Maybe<BondingCurve>
  /** fetch data from the table in a streaming manner: "BondingCurve" */
  BondingCurve_stream: Array<BondingCurve>
  /** fetch data from the table: "LinearVesting" */
  LinearVesting: Array<LinearVesting>
  /** fetch data from the table: "LinearVesting" using primary key columns */
  LinearVesting_by_pk?: Maybe<LinearVesting>
  /** fetch data from the table in a streaming manner: "LinearVesting" */
  LinearVesting_stream: Array<LinearVesting>
  /** fetch data from the table: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor: Array<StreamingPaymentProcessor>
  /** fetch data from the table: "StreamingPaymentProcessor" using primary key columns */
  StreamingPaymentProcessor_by_pk?: Maybe<StreamingPaymentProcessor>
  /** fetch data from the table in a streaming manner: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor_stream: Array<StreamingPaymentProcessor>
  /** fetch data from the table: "Swap" */
  Swap: Array<Swap>
  /** fetch data from the table: "Swap" using primary key columns */
  Swap_by_pk?: Maybe<Swap>
  /** fetch data from the table in a streaming manner: "Swap" */
  Swap_stream: Array<Swap>
  /** fetch data from the table: "Workflow" */
  Workflow: Array<Workflow>
  /** fetch data from the table: "WorkflowModule" */
  WorkflowModule: Array<WorkflowModule>
  /** fetch data from the table: "WorkflowModuleType" */
  WorkflowModuleType: Array<WorkflowModuleType>
  /** fetch data from the table: "WorkflowModuleType" using primary key columns */
  WorkflowModuleType_by_pk?: Maybe<WorkflowModuleType>
  /** fetch data from the table in a streaming manner: "WorkflowModuleType" */
  WorkflowModuleType_stream: Array<WorkflowModuleType>
  /** fetch data from the table: "WorkflowModule" using primary key columns */
  WorkflowModule_by_pk?: Maybe<WorkflowModule>
  /** fetch data from the table in a streaming manner: "WorkflowModule" */
  WorkflowModule_stream: Array<WorkflowModule>
  /** fetch data from the table: "Workflow" using primary key columns */
  Workflow_by_pk?: Maybe<Workflow>
  /** fetch data from the table in a streaming manner: "Workflow" */
  Workflow_stream: Array<Workflow>
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: Maybe<Chain_Metadata>
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream: Array<Chain_Metadata>
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<Dynamic_Contract_Registry>
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<Dynamic_Contract_Registry>
  /** fetch data from the table in a streaming manner: "dynamic_contract_registry" */
  dynamic_contract_registry_stream: Array<Dynamic_Contract_Registry>
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: Array<End_Of_Block_Range_Scanned_Data>
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: Maybe<End_Of_Block_Range_Scanned_Data>
  /** fetch data from the table in a streaming manner: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data_stream: Array<End_Of_Block_Range_Scanned_Data>
  /** fetch data from the table: "entity_history" */
  entity_history: Array<Entity_History>
  /** fetch data from the table: "entity_history" using primary key columns */
  entity_history_by_pk?: Maybe<Entity_History>
  /** fetch data from the table: "entity_history_filter" */
  entity_history_filter: Array<Entity_History_Filter>
  /** fetch data from the table: "entity_history_filter" using primary key columns */
  entity_history_filter_by_pk?: Maybe<Entity_History_Filter>
  /** fetch data from the table in a streaming manner: "entity_history_filter" */
  entity_history_filter_stream: Array<Entity_History_Filter>
  /** fetch data from the table in a streaming manner: "entity_history" */
  entity_history_stream: Array<Entity_History>
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: Array<Event_Sync_State>
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: Maybe<Event_Sync_State>
  /** fetch data from the table in a streaming manner: "event_sync_state" */
  event_sync_state_stream: Array<Event_Sync_State>
  /** This function helps search for articles */
  get_entity_history_filter: Array<Entity_History_Filter>
  /** fetch data from the table: "persisted_state" */
  persisted_state: Array<Persisted_State>
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: Maybe<Persisted_State>
  /** fetch data from the table in a streaming manner: "persisted_state" */
  persisted_state_stream: Array<Persisted_State>
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: Array<Raw_Events>
}

export type Subscription_RootBondingCurveArgs = {
  distinct_on?: InputMaybe<Array<BondingCurve_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<BondingCurve_Order_By>>
  where?: InputMaybe<BondingCurve_Bool_Exp>
}

export type Subscription_RootBondingCurve_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootBondingCurve_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<BondingCurve_Stream_Cursor_Input>>
  where?: InputMaybe<BondingCurve_Bool_Exp>
}

export type Subscription_RootLinearVestingArgs = {
  distinct_on?: InputMaybe<Array<LinearVesting_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<LinearVesting_Order_By>>
  where?: InputMaybe<LinearVesting_Bool_Exp>
}

export type Subscription_RootLinearVesting_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootLinearVesting_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<LinearVesting_Stream_Cursor_Input>>
  where?: InputMaybe<LinearVesting_Bool_Exp>
}

export type Subscription_RootStreamingPaymentProcessorArgs = {
  distinct_on?: InputMaybe<Array<StreamingPaymentProcessor_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<StreamingPaymentProcessor_Order_By>>
  where?: InputMaybe<StreamingPaymentProcessor_Bool_Exp>
}

export type Subscription_RootStreamingPaymentProcessor_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootStreamingPaymentProcessor_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<StreamingPaymentProcessor_Stream_Cursor_Input>>
  where?: InputMaybe<StreamingPaymentProcessor_Bool_Exp>
}

export type Subscription_RootSwapArgs = {
  distinct_on?: InputMaybe<Array<Swap_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Swap_Order_By>>
  where?: InputMaybe<Swap_Bool_Exp>
}

export type Subscription_RootSwap_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootSwap_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Swap_Stream_Cursor_Input>>
  where?: InputMaybe<Swap_Bool_Exp>
}

export type Subscription_RootWorkflowArgs = {
  distinct_on?: InputMaybe<Array<Workflow_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Workflow_Order_By>>
  where?: InputMaybe<Workflow_Bool_Exp>
}

export type Subscription_RootWorkflowModuleArgs = {
  distinct_on?: InputMaybe<Array<WorkflowModule_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<WorkflowModule_Order_By>>
  where?: InputMaybe<WorkflowModule_Bool_Exp>
}

export type Subscription_RootWorkflowModuleTypeArgs = {
  distinct_on?: InputMaybe<Array<WorkflowModuleType_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<WorkflowModuleType_Order_By>>
  where?: InputMaybe<WorkflowModuleType_Bool_Exp>
}

export type Subscription_RootWorkflowModuleType_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootWorkflowModuleType_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<WorkflowModuleType_Stream_Cursor_Input>>
  where?: InputMaybe<WorkflowModuleType_Bool_Exp>
}

export type Subscription_RootWorkflowModule_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootWorkflowModule_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<WorkflowModule_Stream_Cursor_Input>>
  where?: InputMaybe<WorkflowModule_Bool_Exp>
}

export type Subscription_RootWorkflow_By_PkArgs = {
  id: Scalars['String']['input']
}

export type Subscription_RootWorkflow_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Workflow_Stream_Cursor_Input>>
  where?: InputMaybe<Workflow_Bool_Exp>
}

export type Subscription_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>
  where?: InputMaybe<Chain_Metadata_Bool_Exp>
}

export type Subscription_RootChain_Metadata_By_PkArgs = {
  chain_id: Scalars['Int']['input']
}

export type Subscription_RootChain_Metadata_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Chain_Metadata_Stream_Cursor_Input>>
  where?: InputMaybe<Chain_Metadata_Bool_Exp>
}

export type Subscription_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<Dynamic_Contract_Registry_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Dynamic_Contract_Registry_Order_By>>
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>
}

export type Subscription_RootDynamic_Contract_Registry_By_PkArgs = {
  chain_id: Scalars['Int']['input']
  contract_address: Scalars['String']['input']
}

export type Subscription_RootDynamic_Contract_Registry_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Dynamic_Contract_Registry_Stream_Cursor_Input>>
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>
}

export type Subscription_RootEnd_Of_Block_Range_Scanned_DataArgs = {
  distinct_on?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Order_By>>
  where?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>
}

export type Subscription_RootEnd_Of_Block_Range_Scanned_Data_By_PkArgs = {
  block_number: Scalars['Int']['input']
  chain_id: Scalars['Int']['input']
}

export type Subscription_RootEnd_Of_Block_Range_Scanned_Data_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<End_Of_Block_Range_Scanned_Data_Stream_Cursor_Input>>
  where?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>
}

export type Subscription_RootEntity_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Entity_History_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Order_By>>
  where?: InputMaybe<Entity_History_Bool_Exp>
}

export type Subscription_RootEntity_History_By_PkArgs = {
  block_number: Scalars['Int']['input']
  block_timestamp: Scalars['Int']['input']
  chain_id: Scalars['Int']['input']
  entity_id: Scalars['String']['input']
  entity_type: Scalars['entity_type']['input']
  log_index: Scalars['Int']['input']
}

export type Subscription_RootEntity_History_FilterArgs = {
  distinct_on?: InputMaybe<Array<Entity_History_Filter_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Filter_Order_By>>
  where?: InputMaybe<Entity_History_Filter_Bool_Exp>
}

export type Subscription_RootEntity_History_Filter_By_PkArgs = {
  block_number: Scalars['Int']['input']
  block_timestamp: Scalars['Int']['input']
  chain_id: Scalars['Int']['input']
  entity_id: Scalars['String']['input']
  entity_type: Scalars['entity_type']['input']
  log_index: Scalars['Int']['input']
  previous_log_index: Scalars['Int']['input']
}

export type Subscription_RootEntity_History_Filter_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Entity_History_Filter_Stream_Cursor_Input>>
  where?: InputMaybe<Entity_History_Filter_Bool_Exp>
}

export type Subscription_RootEntity_History_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Entity_History_Stream_Cursor_Input>>
  where?: InputMaybe<Entity_History_Bool_Exp>
}

export type Subscription_RootEvent_Sync_StateArgs = {
  distinct_on?: InputMaybe<Array<Event_Sync_State_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Event_Sync_State_Order_By>>
  where?: InputMaybe<Event_Sync_State_Bool_Exp>
}

export type Subscription_RootEvent_Sync_State_By_PkArgs = {
  chain_id: Scalars['Int']['input']
}

export type Subscription_RootEvent_Sync_State_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Event_Sync_State_Stream_Cursor_Input>>
  where?: InputMaybe<Event_Sync_State_Bool_Exp>
}

export type Subscription_RootGet_Entity_History_FilterArgs = {
  args: Get_Entity_History_Filter_Args
  distinct_on?: InputMaybe<Array<Entity_History_Filter_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Entity_History_Filter_Order_By>>
  where?: InputMaybe<Entity_History_Filter_Bool_Exp>
}

export type Subscription_RootPersisted_StateArgs = {
  distinct_on?: InputMaybe<Array<Persisted_State_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Persisted_State_Order_By>>
  where?: InputMaybe<Persisted_State_Bool_Exp>
}

export type Subscription_RootPersisted_State_By_PkArgs = {
  id: Scalars['Int']['input']
}

export type Subscription_RootPersisted_State_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Persisted_State_Stream_Cursor_Input>>
  where?: InputMaybe<Persisted_State_Bool_Exp>
}

export type Subscription_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>
  where?: InputMaybe<Raw_Events_Bool_Exp>
}

export type Subscription_RootRaw_Events_By_PkArgs = {
  chain_id: Scalars['Int']['input']
  event_id: Scalars['numeric']['input']
}

export type Subscription_RootRaw_Events_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Raw_Events_Stream_Cursor_Input>>
  where?: InputMaybe<Raw_Events_Bool_Exp>
}

/** Boolean expression to compare columns of type "swaptype". All fields are combined with logical 'AND'. */
export type Swaptype_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['swaptype']['input']>
  _gt?: InputMaybe<Scalars['swaptype']['input']>
  _gte?: InputMaybe<Scalars['swaptype']['input']>
  _in?: InputMaybe<Array<Scalars['swaptype']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['swaptype']['input']>
  _lte?: InputMaybe<Scalars['swaptype']['input']>
  _neq?: InputMaybe<Scalars['swaptype']['input']>
  _nin?: InputMaybe<Array<Scalars['swaptype']['input']>>
}

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>
  _gt?: InputMaybe<Scalars['timestamp']['input']>
  _gte?: InputMaybe<Scalars['timestamp']['input']>
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamp']['input']>
  _lte?: InputMaybe<Scalars['timestamp']['input']>
  _neq?: InputMaybe<Scalars['timestamp']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>
  _gt?: InputMaybe<Scalars['timestamptz']['input']>
  _gte?: InputMaybe<Scalars['timestamptz']['input']>
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamptz']['input']>
  _lte?: InputMaybe<Scalars['timestamptz']['input']>
  _neq?: InputMaybe<Scalars['timestamptz']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>
}

/** Boolean expression to compare columns of type "vestingstatus". All fields are combined with logical 'AND'. */
export type Vestingstatus_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['vestingstatus']['input']>
  _gt?: InputMaybe<Scalars['vestingstatus']['input']>
  _gte?: InputMaybe<Scalars['vestingstatus']['input']>
  _in?: InputMaybe<Array<Scalars['vestingstatus']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['vestingstatus']['input']>
  _lte?: InputMaybe<Scalars['vestingstatus']['input']>
  _neq?: InputMaybe<Scalars['vestingstatus']['input']>
  _nin?: InputMaybe<Array<Scalars['vestingstatus']['input']>>
}
