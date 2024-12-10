// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
  Boolean: boolean
  Int: number
  String: string
  contract_type: any
  float8: any
  jsonb: any
  numeric: any
  swaptype: any
  timestamp: any
  timestamptz: any
  vestingstatus: any
}

/** columns and relationships of "BondingCurve" */
export interface BondingCurve {
  bcType: Scalars['String'] | null
  buyFee: Scalars['numeric'] | null
  buyReserveRatio: Scalars['numeric'] | null
  chainId: Scalars['Int']
  collateralToken: Scalars['String'] | null
  collateralTokenDecimals: Scalars['Int'] | null
  db_write_timestamp: Scalars['timestamp'] | null
  /** An array relationship */
  feeClaim: FeeClaim[]
  id: Scalars['String']
  issuanceToken: Scalars['String'] | null
  issuanceTokenDecimals: Scalars['Int'] | null
  sellFee: Scalars['numeric'] | null
  sellReserveRatio: Scalars['numeric'] | null
  /** An array relationship */
  swaps: Swap[]
  virtualCollateral: Scalars['float8'] | null
  virtualCollateralRaw: Scalars['numeric'] | null
  virtualIssuance: Scalars['float8'] | null
  /** An object relationship */
  workflow: Workflow | null
  workflow_id: Scalars['String']
  __typename: 'BondingCurve'
}

/** select columns of table "BondingCurve" */
export type BondingCurve_select_column =
  | 'bcType'
  | 'buyFee'
  | 'buyReserveRatio'
  | 'chainId'
  | 'collateralToken'
  | 'collateralTokenDecimals'
  | 'db_write_timestamp'
  | 'id'
  | 'issuanceToken'
  | 'issuanceTokenDecimals'
  | 'sellFee'
  | 'sellReserveRatio'
  | 'virtualCollateral'
  | 'virtualCollateralRaw'
  | 'virtualIssuance'
  | 'workflow_id'

/** columns and relationships of "FeeClaim" */
export interface FeeClaim {
  amount: Scalars['float8']
  blockTimestamp: Scalars['Int']
  /** An object relationship */
  bondingCurve: BondingCurve | null
  bondingCurve_id: Scalars['String']
  chainId: Scalars['Int']
  db_write_timestamp: Scalars['timestamp'] | null
  id: Scalars['String']
  recipient: Scalars['String']
  __typename: 'FeeClaim'
}

/** select columns of table "FeeClaim" */
export type FeeClaim_select_column =
  | 'amount'
  | 'blockTimestamp'
  | 'bondingCurve_id'
  | 'chainId'
  | 'db_write_timestamp'
  | 'id'
  | 'recipient'

/** columns and relationships of "LinearVesting" */
export interface LinearVesting {
  amountRaw: Scalars['numeric']
  blockTimestamp: Scalars['Int']
  chainId: Scalars['Int']
  cliff: Scalars['numeric']
  db_write_timestamp: Scalars['timestamp'] | null
  end: Scalars['numeric']
  id: Scalars['String']
  recipient: Scalars['String']
  start: Scalars['numeric']
  status: Scalars['vestingstatus']
  /** An object relationship */
  streamingPaymentProcessor: StreamingPaymentProcessor | null
  streamingPaymentProcessor_id: Scalars['String']
  token: Scalars['String']
  __typename: 'LinearVesting'
}

/** select columns of table "LinearVesting" */
export type LinearVesting_select_column =
  | 'amountRaw'
  | 'blockTimestamp'
  | 'chainId'
  | 'cliff'
  | 'db_write_timestamp'
  | 'end'
  | 'id'
  | 'recipient'
  | 'start'
  | 'status'
  | 'streamingPaymentProcessor_id'
  | 'token'

/** columns and relationships of "StreamingPaymentProcessor" */
export interface StreamingPaymentProcessor {
  chainId: Scalars['Int']
  db_write_timestamp: Scalars['timestamp'] | null
  id: Scalars['String']
  /** An array relationship */
  vestings: LinearVesting[]
  /** An object relationship */
  workflow: Workflow | null
  workflow_id: Scalars['String']
  __typename: 'StreamingPaymentProcessor'
}

/** select columns of table "StreamingPaymentProcessor" */
export type StreamingPaymentProcessor_select_column =
  | 'chainId'
  | 'db_write_timestamp'
  | 'id'
  | 'workflow_id'

/** columns and relationships of "Swap" */
export interface Swap {
  blockTimestamp: Scalars['Int']
  /** An object relationship */
  bondingCurve: BondingCurve | null
  bondingCurve_id: Scalars['String']
  chainId: Scalars['Int']
  collateralAmount: Scalars['float8']
  collateralToken: Scalars['String']
  db_write_timestamp: Scalars['timestamp'] | null
  id: Scalars['String']
  initiator: Scalars['String']
  issuanceAmount: Scalars['float8']
  issuanceToken: Scalars['String']
  priceInCol: Scalars['float8']
  recipient: Scalars['String']
  swapType: Scalars['swaptype']
  __typename: 'Swap'
}

/** select columns of table "Swap" */
export type Swap_select_column =
  | 'blockTimestamp'
  | 'bondingCurve_id'
  | 'chainId'
  | 'collateralAmount'
  | 'collateralToken'
  | 'db_write_timestamp'
  | 'id'
  | 'initiator'
  | 'issuanceAmount'
  | 'issuanceToken'
  | 'priceInCol'
  | 'recipient'
  | 'swapType'

/** columns and relationships of "Workflow" */
export interface Workflow {
  /** An object relationship */
  authorizer: WorkflowModule | null
  authorizer_id: Scalars['String']
  chainId: Scalars['Int']
  db_write_timestamp: Scalars['timestamp'] | null
  /** An object relationship */
  fundingManager: WorkflowModule | null
  fundingManager_id: Scalars['String']
  id: Scalars['String']
  optionalModules: Scalars['String'][] | null
  orchestratorId: Scalars['numeric']
  /** An object relationship */
  paymentProcessor: WorkflowModule | null
  paymentProcessor_id: Scalars['String']
  __typename: 'Workflow'
}

/** columns and relationships of "WorkflowModule" */
export interface WorkflowModule {
  chainId: Scalars['Int']
  db_write_timestamp: Scalars['timestamp'] | null
  id: Scalars['String']
  /** An object relationship */
  moduleType: WorkflowModuleType | null
  moduleType_id: Scalars['String']
  orchestrator: Scalars['String']
  __typename: 'WorkflowModule'
}

/** columns and relationships of "WorkflowModuleType" */
export interface WorkflowModuleType {
  beacon: Scalars['String']
  chainId: Scalars['Int']
  db_write_timestamp: Scalars['timestamp'] | null
  id: Scalars['String']
  majorVersion: Scalars['numeric']
  minorVersion: Scalars['numeric']
  name: Scalars['String']
  patchVersion: Scalars['numeric']
  url: Scalars['String']
  __typename: 'WorkflowModuleType'
}

/** select columns of table "WorkflowModuleType" */
export type WorkflowModuleType_select_column =
  | 'beacon'
  | 'chainId'
  | 'db_write_timestamp'
  | 'id'
  | 'majorVersion'
  | 'minorVersion'
  | 'name'
  | 'patchVersion'
  | 'url'

/** select columns of table "WorkflowModule" */
export type WorkflowModule_select_column =
  | 'chainId'
  | 'db_write_timestamp'
  | 'id'
  | 'moduleType_id'
  | 'orchestrator'

/** select columns of table "Workflow" */
export type Workflow_select_column =
  | 'authorizer_id'
  | 'chainId'
  | 'db_write_timestamp'
  | 'fundingManager_id'
  | 'id'
  | 'optionalModules'
  | 'orchestratorId'
  | 'paymentProcessor_id'

/** columns and relationships of "chain_metadata" */
export interface chain_metadata {
  block_height: Scalars['Int']
  chain_id: Scalars['Int']
  end_block: Scalars['Int'] | null
  first_event_block_number: Scalars['Int'] | null
  is_hyper_sync: Scalars['Boolean']
  latest_fetched_block_number: Scalars['Int']
  latest_processed_block: Scalars['Int'] | null
  num_batches_fetched: Scalars['Int']
  num_events_processed: Scalars['Int'] | null
  start_block: Scalars['Int']
  timestamp_caught_up_to_head_or_endblock: Scalars['timestamptz'] | null
  __typename: 'chain_metadata'
}

/** select columns of table "chain_metadata" */
export type chain_metadata_select_column =
  | 'block_height'
  | 'chain_id'
  | 'end_block'
  | 'first_event_block_number'
  | 'is_hyper_sync'
  | 'latest_fetched_block_number'
  | 'latest_processed_block'
  | 'num_batches_fetched'
  | 'num_events_processed'
  | 'start_block'
  | 'timestamp_caught_up_to_head_or_endblock'

/** ordering argument of a cursor */
export type cursor_ordering = 'ASC' | 'DESC'

/** columns and relationships of "dynamic_contract_registry" */
export interface dynamic_contract_registry {
  chain_id: Scalars['Int']
  contract_address: Scalars['String']
  contract_type: Scalars['contract_type']
  id: Scalars['String']
  registering_event_block_number: Scalars['Int']
  registering_event_block_timestamp: Scalars['Int']
  registering_event_contract_name: Scalars['String']
  registering_event_log_index: Scalars['Int']
  registering_event_name: Scalars['String']
  registering_event_src_address: Scalars['String']
  __typename: 'dynamic_contract_registry'
}

/** select columns of table "dynamic_contract_registry" */
export type dynamic_contract_registry_select_column =
  | 'chain_id'
  | 'contract_address'
  | 'contract_type'
  | 'id'
  | 'registering_event_block_number'
  | 'registering_event_block_timestamp'
  | 'registering_event_contract_name'
  | 'registering_event_log_index'
  | 'registering_event_name'
  | 'registering_event_src_address'

/** columns and relationships of "end_of_block_range_scanned_data" */
export interface end_of_block_range_scanned_data {
  block_hash: Scalars['String']
  block_number: Scalars['Int']
  block_timestamp: Scalars['Int']
  chain_id: Scalars['Int']
  __typename: 'end_of_block_range_scanned_data'
}

/** select columns of table "end_of_block_range_scanned_data" */
export type end_of_block_range_scanned_data_select_column =
  | 'block_hash'
  | 'block_number'
  | 'block_timestamp'
  | 'chain_id'

/** columns and relationships of "event_sync_state" */
export interface event_sync_state {
  block_number: Scalars['Int']
  block_timestamp: Scalars['Int']
  chain_id: Scalars['Int']
  is_pre_registering_dynamic_contracts: Scalars['Boolean']
  log_index: Scalars['Int']
  __typename: 'event_sync_state'
}

/** select columns of table "event_sync_state" */
export type event_sync_state_select_column =
  | 'block_number'
  | 'block_timestamp'
  | 'chain_id'
  | 'is_pre_registering_dynamic_contracts'
  | 'log_index'

/** column ordering options */
export type order_by =
  | 'asc'
  | 'asc_nulls_first'
  | 'asc_nulls_last'
  | 'desc'
  | 'desc_nulls_first'
  | 'desc_nulls_last'

/** columns and relationships of "persisted_state" */
export interface persisted_state {
  abi_files_hash: Scalars['String']
  config_hash: Scalars['String']
  envio_version: Scalars['String']
  handler_files_hash: Scalars['String']
  id: Scalars['Int']
  schema_hash: Scalars['String']
  __typename: 'persisted_state'
}

/** select columns of table "persisted_state" */
export type persisted_state_select_column =
  | 'abi_files_hash'
  | 'config_hash'
  | 'envio_version'
  | 'handler_files_hash'
  | 'id'
  | 'schema_hash'

export interface query_root {
  /** fetch data from the table: "BondingCurve" */
  BondingCurve: BondingCurve[]
  /** fetch data from the table: "BondingCurve" using primary key columns */
  BondingCurve_by_pk: BondingCurve | null
  /** fetch data from the table: "FeeClaim" */
  FeeClaim: FeeClaim[]
  /** fetch data from the table: "FeeClaim" using primary key columns */
  FeeClaim_by_pk: FeeClaim | null
  /** fetch data from the table: "LinearVesting" */
  LinearVesting: LinearVesting[]
  /** fetch data from the table: "LinearVesting" using primary key columns */
  LinearVesting_by_pk: LinearVesting | null
  /** fetch data from the table: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor: StreamingPaymentProcessor[]
  /** fetch data from the table: "StreamingPaymentProcessor" using primary key columns */
  StreamingPaymentProcessor_by_pk: StreamingPaymentProcessor | null
  /** fetch data from the table: "Swap" */
  Swap: Swap[]
  /** fetch data from the table: "Swap" using primary key columns */
  Swap_by_pk: Swap | null
  /** fetch data from the table: "Workflow" */
  Workflow: Workflow[]
  /** fetch data from the table: "WorkflowModule" */
  WorkflowModule: WorkflowModule[]
  /** fetch data from the table: "WorkflowModuleType" */
  WorkflowModuleType: WorkflowModuleType[]
  /** fetch data from the table: "WorkflowModuleType" using primary key columns */
  WorkflowModuleType_by_pk: WorkflowModuleType | null
  /** fetch data from the table: "WorkflowModule" using primary key columns */
  WorkflowModule_by_pk: WorkflowModule | null
  /** fetch data from the table: "Workflow" using primary key columns */
  Workflow_by_pk: Workflow | null
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: chain_metadata[]
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk: chain_metadata | null
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: dynamic_contract_registry[]
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk: dynamic_contract_registry | null
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: end_of_block_range_scanned_data[]
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk: end_of_block_range_scanned_data | null
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: event_sync_state[]
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk: event_sync_state | null
  /** fetch data from the table: "persisted_state" */
  persisted_state: persisted_state[]
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk: persisted_state | null
  /** fetch data from the table: "raw_events" */
  raw_events: raw_events[]
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk: raw_events | null
  __typename: 'query_root'
}

/** columns and relationships of "raw_events" */
export interface raw_events {
  block_fields: Scalars['jsonb']
  block_hash: Scalars['String']
  block_number: Scalars['Int']
  block_timestamp: Scalars['Int']
  chain_id: Scalars['Int']
  contract_name: Scalars['String']
  db_write_timestamp: Scalars['timestamp'] | null
  event_id: Scalars['numeric']
  event_name: Scalars['String']
  log_index: Scalars['Int']
  params: Scalars['jsonb']
  serial: Scalars['Int']
  src_address: Scalars['String']
  transaction_fields: Scalars['jsonb']
  __typename: 'raw_events'
}

/** select columns of table "raw_events" */
export type raw_events_select_column =
  | 'block_fields'
  | 'block_hash'
  | 'block_number'
  | 'block_timestamp'
  | 'chain_id'
  | 'contract_name'
  | 'db_write_timestamp'
  | 'event_id'
  | 'event_name'
  | 'log_index'
  | 'params'
  | 'serial'
  | 'src_address'
  | 'transaction_fields'

export interface subscription_root {
  /** fetch data from the table: "BondingCurve" */
  BondingCurve: BondingCurve[]
  /** fetch data from the table: "BondingCurve" using primary key columns */
  BondingCurve_by_pk: BondingCurve | null
  /** fetch data from the table in a streaming manner: "BondingCurve" */
  BondingCurve_stream: BondingCurve[]
  /** fetch data from the table: "FeeClaim" */
  FeeClaim: FeeClaim[]
  /** fetch data from the table: "FeeClaim" using primary key columns */
  FeeClaim_by_pk: FeeClaim | null
  /** fetch data from the table in a streaming manner: "FeeClaim" */
  FeeClaim_stream: FeeClaim[]
  /** fetch data from the table: "LinearVesting" */
  LinearVesting: LinearVesting[]
  /** fetch data from the table: "LinearVesting" using primary key columns */
  LinearVesting_by_pk: LinearVesting | null
  /** fetch data from the table in a streaming manner: "LinearVesting" */
  LinearVesting_stream: LinearVesting[]
  /** fetch data from the table: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor: StreamingPaymentProcessor[]
  /** fetch data from the table: "StreamingPaymentProcessor" using primary key columns */
  StreamingPaymentProcessor_by_pk: StreamingPaymentProcessor | null
  /** fetch data from the table in a streaming manner: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor_stream: StreamingPaymentProcessor[]
  /** fetch data from the table: "Swap" */
  Swap: Swap[]
  /** fetch data from the table: "Swap" using primary key columns */
  Swap_by_pk: Swap | null
  /** fetch data from the table in a streaming manner: "Swap" */
  Swap_stream: Swap[]
  /** fetch data from the table: "Workflow" */
  Workflow: Workflow[]
  /** fetch data from the table: "WorkflowModule" */
  WorkflowModule: WorkflowModule[]
  /** fetch data from the table: "WorkflowModuleType" */
  WorkflowModuleType: WorkflowModuleType[]
  /** fetch data from the table: "WorkflowModuleType" using primary key columns */
  WorkflowModuleType_by_pk: WorkflowModuleType | null
  /** fetch data from the table in a streaming manner: "WorkflowModuleType" */
  WorkflowModuleType_stream: WorkflowModuleType[]
  /** fetch data from the table: "WorkflowModule" using primary key columns */
  WorkflowModule_by_pk: WorkflowModule | null
  /** fetch data from the table in a streaming manner: "WorkflowModule" */
  WorkflowModule_stream: WorkflowModule[]
  /** fetch data from the table: "Workflow" using primary key columns */
  Workflow_by_pk: Workflow | null
  /** fetch data from the table in a streaming manner: "Workflow" */
  Workflow_stream: Workflow[]
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: chain_metadata[]
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk: chain_metadata | null
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream: chain_metadata[]
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: dynamic_contract_registry[]
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk: dynamic_contract_registry | null
  /** fetch data from the table in a streaming manner: "dynamic_contract_registry" */
  dynamic_contract_registry_stream: dynamic_contract_registry[]
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: end_of_block_range_scanned_data[]
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk: end_of_block_range_scanned_data | null
  /** fetch data from the table in a streaming manner: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data_stream: end_of_block_range_scanned_data[]
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: event_sync_state[]
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk: event_sync_state | null
  /** fetch data from the table in a streaming manner: "event_sync_state" */
  event_sync_state_stream: event_sync_state[]
  /** fetch data from the table: "persisted_state" */
  persisted_state: persisted_state[]
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk: persisted_state | null
  /** fetch data from the table in a streaming manner: "persisted_state" */
  persisted_state_stream: persisted_state[]
  /** fetch data from the table: "raw_events" */
  raw_events: raw_events[]
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk: raw_events | null
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: raw_events[]
  __typename: 'subscription_root'
}

export type Query = query_root
export type Subscription = subscription_root

/** columns and relationships of "BondingCurve" */
export interface BondingCurveGenqlSelection {
  bcType?: boolean | number
  buyFee?: boolean | number
  buyReserveRatio?: boolean | number
  chainId?: boolean | number
  collateralToken?: boolean | number
  collateralTokenDecimals?: boolean | number
  db_write_timestamp?: boolean | number
  /** An array relationship */
  feeClaim?: FeeClaimGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: FeeClaim_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: FeeClaim_order_by[] | null
      /** filter the rows returned */
      where?: FeeClaim_bool_exp | null
    }
  }
  id?: boolean | number
  issuanceToken?: boolean | number
  issuanceTokenDecimals?: boolean | number
  sellFee?: boolean | number
  sellReserveRatio?: boolean | number
  /** An array relationship */
  swaps?: SwapGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: Swap_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: Swap_order_by[] | null
      /** filter the rows returned */
      where?: Swap_bool_exp | null
    }
  }
  virtualCollateral?: boolean | number
  virtualCollateralRaw?: boolean | number
  virtualIssuance?: boolean | number
  /** An object relationship */
  workflow?: WorkflowGenqlSelection
  workflow_id?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "BondingCurve". All fields are combined with a logical 'AND'. */
export interface BondingCurve_bool_exp {
  _and?: BondingCurve_bool_exp[] | null
  _not?: BondingCurve_bool_exp | null
  _or?: BondingCurve_bool_exp[] | null
  bcType?: String_comparison_exp | null
  buyFee?: numeric_comparison_exp | null
  buyReserveRatio?: numeric_comparison_exp | null
  chainId?: Int_comparison_exp | null
  collateralToken?: String_comparison_exp | null
  collateralTokenDecimals?: Int_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  feeClaim?: FeeClaim_bool_exp | null
  id?: String_comparison_exp | null
  issuanceToken?: String_comparison_exp | null
  issuanceTokenDecimals?: Int_comparison_exp | null
  sellFee?: numeric_comparison_exp | null
  sellReserveRatio?: numeric_comparison_exp | null
  swaps?: Swap_bool_exp | null
  virtualCollateral?: float8_comparison_exp | null
  virtualCollateralRaw?: numeric_comparison_exp | null
  virtualIssuance?: float8_comparison_exp | null
  workflow?: Workflow_bool_exp | null
  workflow_id?: String_comparison_exp | null
}

/** Ordering options when selecting data from "BondingCurve". */
export interface BondingCurve_order_by {
  bcType?: order_by | null
  buyFee?: order_by | null
  buyReserveRatio?: order_by | null
  chainId?: order_by | null
  collateralToken?: order_by | null
  collateralTokenDecimals?: order_by | null
  db_write_timestamp?: order_by | null
  feeClaim_aggregate?: FeeClaim_aggregate_order_by | null
  id?: order_by | null
  issuanceToken?: order_by | null
  issuanceTokenDecimals?: order_by | null
  sellFee?: order_by | null
  sellReserveRatio?: order_by | null
  swaps_aggregate?: Swap_aggregate_order_by | null
  virtualCollateral?: order_by | null
  virtualCollateralRaw?: order_by | null
  virtualIssuance?: order_by | null
  workflow?: Workflow_order_by | null
  workflow_id?: order_by | null
}

/** Streaming cursor of the table "BondingCurve" */
export interface BondingCurve_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: BondingCurve_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface BondingCurve_stream_cursor_value_input {
  bcType?: Scalars['String'] | null
  buyFee?: Scalars['numeric'] | null
  buyReserveRatio?: Scalars['numeric'] | null
  chainId?: Scalars['Int'] | null
  collateralToken?: Scalars['String'] | null
  collateralTokenDecimals?: Scalars['Int'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  id?: Scalars['String'] | null
  issuanceToken?: Scalars['String'] | null
  issuanceTokenDecimals?: Scalars['Int'] | null
  sellFee?: Scalars['numeric'] | null
  sellReserveRatio?: Scalars['numeric'] | null
  virtualCollateral?: Scalars['float8'] | null
  virtualCollateralRaw?: Scalars['numeric'] | null
  virtualIssuance?: Scalars['float8'] | null
  workflow_id?: Scalars['String'] | null
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export interface Boolean_comparison_exp {
  _eq?: Scalars['Boolean'] | null
  _gt?: Scalars['Boolean'] | null
  _gte?: Scalars['Boolean'] | null
  _in?: Scalars['Boolean'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['Boolean'] | null
  _lte?: Scalars['Boolean'] | null
  _neq?: Scalars['Boolean'] | null
  _nin?: Scalars['Boolean'][] | null
}

/** columns and relationships of "FeeClaim" */
export interface FeeClaimGenqlSelection {
  amount?: boolean | number
  blockTimestamp?: boolean | number
  /** An object relationship */
  bondingCurve?: BondingCurveGenqlSelection
  bondingCurve_id?: boolean | number
  chainId?: boolean | number
  db_write_timestamp?: boolean | number
  id?: boolean | number
  recipient?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** order by aggregate values of table "FeeClaim" */
export interface FeeClaim_aggregate_order_by {
  avg?: FeeClaim_avg_order_by | null
  count?: order_by | null
  max?: FeeClaim_max_order_by | null
  min?: FeeClaim_min_order_by | null
  stddev?: FeeClaim_stddev_order_by | null
  stddev_pop?: FeeClaim_stddev_pop_order_by | null
  stddev_samp?: FeeClaim_stddev_samp_order_by | null
  sum?: FeeClaim_sum_order_by | null
  var_pop?: FeeClaim_var_pop_order_by | null
  var_samp?: FeeClaim_var_samp_order_by | null
  variance?: FeeClaim_variance_order_by | null
}

/** order by avg() on columns of table "FeeClaim" */
export interface FeeClaim_avg_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** Boolean expression to filter rows from the table "FeeClaim". All fields are combined with a logical 'AND'. */
export interface FeeClaim_bool_exp {
  _and?: FeeClaim_bool_exp[] | null
  _not?: FeeClaim_bool_exp | null
  _or?: FeeClaim_bool_exp[] | null
  amount?: float8_comparison_exp | null
  blockTimestamp?: Int_comparison_exp | null
  bondingCurve?: BondingCurve_bool_exp | null
  bondingCurve_id?: String_comparison_exp | null
  chainId?: Int_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  id?: String_comparison_exp | null
  recipient?: String_comparison_exp | null
}

/** order by max() on columns of table "FeeClaim" */
export interface FeeClaim_max_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  bondingCurve_id?: order_by | null
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  recipient?: order_by | null
}

/** order by min() on columns of table "FeeClaim" */
export interface FeeClaim_min_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  bondingCurve_id?: order_by | null
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  recipient?: order_by | null
}

/** Ordering options when selecting data from "FeeClaim". */
export interface FeeClaim_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  bondingCurve?: BondingCurve_order_by | null
  bondingCurve_id?: order_by | null
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  recipient?: order_by | null
}

/** order by stddev() on columns of table "FeeClaim" */
export interface FeeClaim_stddev_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** order by stddev_pop() on columns of table "FeeClaim" */
export interface FeeClaim_stddev_pop_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** order by stddev_samp() on columns of table "FeeClaim" */
export interface FeeClaim_stddev_samp_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** Streaming cursor of the table "FeeClaim" */
export interface FeeClaim_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: FeeClaim_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface FeeClaim_stream_cursor_value_input {
  amount?: Scalars['float8'] | null
  blockTimestamp?: Scalars['Int'] | null
  bondingCurve_id?: Scalars['String'] | null
  chainId?: Scalars['Int'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  id?: Scalars['String'] | null
  recipient?: Scalars['String'] | null
}

/** order by sum() on columns of table "FeeClaim" */
export interface FeeClaim_sum_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** order by var_pop() on columns of table "FeeClaim" */
export interface FeeClaim_var_pop_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** order by var_samp() on columns of table "FeeClaim" */
export interface FeeClaim_var_samp_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** order by variance() on columns of table "FeeClaim" */
export interface FeeClaim_variance_order_by {
  amount?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export interface Int_comparison_exp {
  _eq?: Scalars['Int'] | null
  _gt?: Scalars['Int'] | null
  _gte?: Scalars['Int'] | null
  _in?: Scalars['Int'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['Int'] | null
  _lte?: Scalars['Int'] | null
  _neq?: Scalars['Int'] | null
  _nin?: Scalars['Int'][] | null
}

/** columns and relationships of "LinearVesting" */
export interface LinearVestingGenqlSelection {
  amountRaw?: boolean | number
  blockTimestamp?: boolean | number
  chainId?: boolean | number
  cliff?: boolean | number
  db_write_timestamp?: boolean | number
  end?: boolean | number
  id?: boolean | number
  recipient?: boolean | number
  start?: boolean | number
  status?: boolean | number
  /** An object relationship */
  streamingPaymentProcessor?: StreamingPaymentProcessorGenqlSelection
  streamingPaymentProcessor_id?: boolean | number
  token?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** order by aggregate values of table "LinearVesting" */
export interface LinearVesting_aggregate_order_by {
  avg?: LinearVesting_avg_order_by | null
  count?: order_by | null
  max?: LinearVesting_max_order_by | null
  min?: LinearVesting_min_order_by | null
  stddev?: LinearVesting_stddev_order_by | null
  stddev_pop?: LinearVesting_stddev_pop_order_by | null
  stddev_samp?: LinearVesting_stddev_samp_order_by | null
  sum?: LinearVesting_sum_order_by | null
  var_pop?: LinearVesting_var_pop_order_by | null
  var_samp?: LinearVesting_var_samp_order_by | null
  variance?: LinearVesting_variance_order_by | null
}

/** order by avg() on columns of table "LinearVesting" */
export interface LinearVesting_avg_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** Boolean expression to filter rows from the table "LinearVesting". All fields are combined with a logical 'AND'. */
export interface LinearVesting_bool_exp {
  _and?: LinearVesting_bool_exp[] | null
  _not?: LinearVesting_bool_exp | null
  _or?: LinearVesting_bool_exp[] | null
  amountRaw?: numeric_comparison_exp | null
  blockTimestamp?: Int_comparison_exp | null
  chainId?: Int_comparison_exp | null
  cliff?: numeric_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  end?: numeric_comparison_exp | null
  id?: String_comparison_exp | null
  recipient?: String_comparison_exp | null
  start?: numeric_comparison_exp | null
  status?: vestingstatus_comparison_exp | null
  streamingPaymentProcessor?: StreamingPaymentProcessor_bool_exp | null
  streamingPaymentProcessor_id?: String_comparison_exp | null
  token?: String_comparison_exp | null
}

/** order by max() on columns of table "LinearVesting" */
export interface LinearVesting_max_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  db_write_timestamp?: order_by | null
  end?: order_by | null
  id?: order_by | null
  recipient?: order_by | null
  start?: order_by | null
  status?: order_by | null
  streamingPaymentProcessor_id?: order_by | null
  token?: order_by | null
}

/** order by min() on columns of table "LinearVesting" */
export interface LinearVesting_min_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  db_write_timestamp?: order_by | null
  end?: order_by | null
  id?: order_by | null
  recipient?: order_by | null
  start?: order_by | null
  status?: order_by | null
  streamingPaymentProcessor_id?: order_by | null
  token?: order_by | null
}

/** Ordering options when selecting data from "LinearVesting". */
export interface LinearVesting_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  db_write_timestamp?: order_by | null
  end?: order_by | null
  id?: order_by | null
  recipient?: order_by | null
  start?: order_by | null
  status?: order_by | null
  streamingPaymentProcessor?: StreamingPaymentProcessor_order_by | null
  streamingPaymentProcessor_id?: order_by | null
  token?: order_by | null
}

/** order by stddev() on columns of table "LinearVesting" */
export interface LinearVesting_stddev_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** order by stddev_pop() on columns of table "LinearVesting" */
export interface LinearVesting_stddev_pop_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** order by stddev_samp() on columns of table "LinearVesting" */
export interface LinearVesting_stddev_samp_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** Streaming cursor of the table "LinearVesting" */
export interface LinearVesting_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: LinearVesting_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface LinearVesting_stream_cursor_value_input {
  amountRaw?: Scalars['numeric'] | null
  blockTimestamp?: Scalars['Int'] | null
  chainId?: Scalars['Int'] | null
  cliff?: Scalars['numeric'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  end?: Scalars['numeric'] | null
  id?: Scalars['String'] | null
  recipient?: Scalars['String'] | null
  start?: Scalars['numeric'] | null
  status?: Scalars['vestingstatus'] | null
  streamingPaymentProcessor_id?: Scalars['String'] | null
  token?: Scalars['String'] | null
}

/** order by sum() on columns of table "LinearVesting" */
export interface LinearVesting_sum_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** order by var_pop() on columns of table "LinearVesting" */
export interface LinearVesting_var_pop_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** order by var_samp() on columns of table "LinearVesting" */
export interface LinearVesting_var_samp_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** order by variance() on columns of table "LinearVesting" */
export interface LinearVesting_variance_order_by {
  amountRaw?: order_by | null
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  cliff?: order_by | null
  end?: order_by | null
  start?: order_by | null
}

/** columns and relationships of "StreamingPaymentProcessor" */
export interface StreamingPaymentProcessorGenqlSelection {
  chainId?: boolean | number
  db_write_timestamp?: boolean | number
  id?: boolean | number
  /** An array relationship */
  vestings?: LinearVestingGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: LinearVesting_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: LinearVesting_order_by[] | null
      /** filter the rows returned */
      where?: LinearVesting_bool_exp | null
    }
  }
  /** An object relationship */
  workflow?: WorkflowGenqlSelection
  workflow_id?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "StreamingPaymentProcessor". All fields are combined with a logical 'AND'. */
export interface StreamingPaymentProcessor_bool_exp {
  _and?: StreamingPaymentProcessor_bool_exp[] | null
  _not?: StreamingPaymentProcessor_bool_exp | null
  _or?: StreamingPaymentProcessor_bool_exp[] | null
  chainId?: Int_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  id?: String_comparison_exp | null
  vestings?: LinearVesting_bool_exp | null
  workflow?: Workflow_bool_exp | null
  workflow_id?: String_comparison_exp | null
}

/** Ordering options when selecting data from "StreamingPaymentProcessor". */
export interface StreamingPaymentProcessor_order_by {
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  vestings_aggregate?: LinearVesting_aggregate_order_by | null
  workflow?: Workflow_order_by | null
  workflow_id?: order_by | null
}

/** Streaming cursor of the table "StreamingPaymentProcessor" */
export interface StreamingPaymentProcessor_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: StreamingPaymentProcessor_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface StreamingPaymentProcessor_stream_cursor_value_input {
  chainId?: Scalars['Int'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  id?: Scalars['String'] | null
  workflow_id?: Scalars['String'] | null
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface String_array_comparison_exp {
  /** is the array contained in the given array value */
  _contained_in?: Scalars['String'][] | null
  /** does the array contain the given value */
  _contains?: Scalars['String'][] | null
  _eq?: Scalars['String'][] | null
  _gt?: Scalars['String'][] | null
  _gte?: Scalars['String'][] | null
  _in?: Scalars['String'][][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['String'][] | null
  _lte?: Scalars['String'][] | null
  _neq?: Scalars['String'][] | null
  _nin?: Scalars['String'][][] | null
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface String_comparison_exp {
  _eq?: Scalars['String'] | null
  _gt?: Scalars['String'] | null
  _gte?: Scalars['String'] | null
  /** does the column match the given case-insensitive pattern */
  _ilike?: Scalars['String'] | null
  _in?: Scalars['String'][] | null
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: Scalars['String'] | null
  _is_null?: Scalars['Boolean'] | null
  /** does the column match the given pattern */
  _like?: Scalars['String'] | null
  _lt?: Scalars['String'] | null
  _lte?: Scalars['String'] | null
  _neq?: Scalars['String'] | null
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Scalars['String'] | null
  _nin?: Scalars['String'][] | null
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: Scalars['String'] | null
  /** does the column NOT match the given pattern */
  _nlike?: Scalars['String'] | null
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: Scalars['String'] | null
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Scalars['String'] | null
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: Scalars['String'] | null
  /** does the column match the given SQL regular expression */
  _similar?: Scalars['String'] | null
}

/** columns and relationships of "Swap" */
export interface SwapGenqlSelection {
  blockTimestamp?: boolean | number
  /** An object relationship */
  bondingCurve?: BondingCurveGenqlSelection
  bondingCurve_id?: boolean | number
  chainId?: boolean | number
  collateralAmount?: boolean | number
  collateralToken?: boolean | number
  db_write_timestamp?: boolean | number
  id?: boolean | number
  initiator?: boolean | number
  issuanceAmount?: boolean | number
  issuanceToken?: boolean | number
  priceInCol?: boolean | number
  recipient?: boolean | number
  swapType?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** order by aggregate values of table "Swap" */
export interface Swap_aggregate_order_by {
  avg?: Swap_avg_order_by | null
  count?: order_by | null
  max?: Swap_max_order_by | null
  min?: Swap_min_order_by | null
  stddev?: Swap_stddev_order_by | null
  stddev_pop?: Swap_stddev_pop_order_by | null
  stddev_samp?: Swap_stddev_samp_order_by | null
  sum?: Swap_sum_order_by | null
  var_pop?: Swap_var_pop_order_by | null
  var_samp?: Swap_var_samp_order_by | null
  variance?: Swap_variance_order_by | null
}

/** order by avg() on columns of table "Swap" */
export interface Swap_avg_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** Boolean expression to filter rows from the table "Swap". All fields are combined with a logical 'AND'. */
export interface Swap_bool_exp {
  _and?: Swap_bool_exp[] | null
  _not?: Swap_bool_exp | null
  _or?: Swap_bool_exp[] | null
  blockTimestamp?: Int_comparison_exp | null
  bondingCurve?: BondingCurve_bool_exp | null
  bondingCurve_id?: String_comparison_exp | null
  chainId?: Int_comparison_exp | null
  collateralAmount?: float8_comparison_exp | null
  collateralToken?: String_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  id?: String_comparison_exp | null
  initiator?: String_comparison_exp | null
  issuanceAmount?: float8_comparison_exp | null
  issuanceToken?: String_comparison_exp | null
  priceInCol?: float8_comparison_exp | null
  recipient?: String_comparison_exp | null
  swapType?: swaptype_comparison_exp | null
}

/** order by max() on columns of table "Swap" */
export interface Swap_max_order_by {
  blockTimestamp?: order_by | null
  bondingCurve_id?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  collateralToken?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  initiator?: order_by | null
  issuanceAmount?: order_by | null
  issuanceToken?: order_by | null
  priceInCol?: order_by | null
  recipient?: order_by | null
  swapType?: order_by | null
}

/** order by min() on columns of table "Swap" */
export interface Swap_min_order_by {
  blockTimestamp?: order_by | null
  bondingCurve_id?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  collateralToken?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  initiator?: order_by | null
  issuanceAmount?: order_by | null
  issuanceToken?: order_by | null
  priceInCol?: order_by | null
  recipient?: order_by | null
  swapType?: order_by | null
}

/** Ordering options when selecting data from "Swap". */
export interface Swap_order_by {
  blockTimestamp?: order_by | null
  bondingCurve?: BondingCurve_order_by | null
  bondingCurve_id?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  collateralToken?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  initiator?: order_by | null
  issuanceAmount?: order_by | null
  issuanceToken?: order_by | null
  priceInCol?: order_by | null
  recipient?: order_by | null
  swapType?: order_by | null
}

/** order by stddev() on columns of table "Swap" */
export interface Swap_stddev_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** order by stddev_pop() on columns of table "Swap" */
export interface Swap_stddev_pop_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** order by stddev_samp() on columns of table "Swap" */
export interface Swap_stddev_samp_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** Streaming cursor of the table "Swap" */
export interface Swap_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: Swap_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface Swap_stream_cursor_value_input {
  blockTimestamp?: Scalars['Int'] | null
  bondingCurve_id?: Scalars['String'] | null
  chainId?: Scalars['Int'] | null
  collateralAmount?: Scalars['float8'] | null
  collateralToken?: Scalars['String'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  id?: Scalars['String'] | null
  initiator?: Scalars['String'] | null
  issuanceAmount?: Scalars['float8'] | null
  issuanceToken?: Scalars['String'] | null
  priceInCol?: Scalars['float8'] | null
  recipient?: Scalars['String'] | null
  swapType?: Scalars['swaptype'] | null
}

/** order by sum() on columns of table "Swap" */
export interface Swap_sum_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** order by var_pop() on columns of table "Swap" */
export interface Swap_var_pop_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** order by var_samp() on columns of table "Swap" */
export interface Swap_var_samp_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** order by variance() on columns of table "Swap" */
export interface Swap_variance_order_by {
  blockTimestamp?: order_by | null
  chainId?: order_by | null
  collateralAmount?: order_by | null
  issuanceAmount?: order_by | null
  priceInCol?: order_by | null
}

/** columns and relationships of "Workflow" */
export interface WorkflowGenqlSelection {
  /** An object relationship */
  authorizer?: WorkflowModuleGenqlSelection
  authorizer_id?: boolean | number
  chainId?: boolean | number
  db_write_timestamp?: boolean | number
  /** An object relationship */
  fundingManager?: WorkflowModuleGenqlSelection
  fundingManager_id?: boolean | number
  id?: boolean | number
  optionalModules?: boolean | number
  orchestratorId?: boolean | number
  /** An object relationship */
  paymentProcessor?: WorkflowModuleGenqlSelection
  paymentProcessor_id?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** columns and relationships of "WorkflowModule" */
export interface WorkflowModuleGenqlSelection {
  chainId?: boolean | number
  db_write_timestamp?: boolean | number
  id?: boolean | number
  /** An object relationship */
  moduleType?: WorkflowModuleTypeGenqlSelection
  moduleType_id?: boolean | number
  orchestrator?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** columns and relationships of "WorkflowModuleType" */
export interface WorkflowModuleTypeGenqlSelection {
  beacon?: boolean | number
  chainId?: boolean | number
  db_write_timestamp?: boolean | number
  id?: boolean | number
  majorVersion?: boolean | number
  minorVersion?: boolean | number
  name?: boolean | number
  patchVersion?: boolean | number
  url?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "WorkflowModuleType". All fields are combined with a logical 'AND'. */
export interface WorkflowModuleType_bool_exp {
  _and?: WorkflowModuleType_bool_exp[] | null
  _not?: WorkflowModuleType_bool_exp | null
  _or?: WorkflowModuleType_bool_exp[] | null
  beacon?: String_comparison_exp | null
  chainId?: Int_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  id?: String_comparison_exp | null
  majorVersion?: numeric_comparison_exp | null
  minorVersion?: numeric_comparison_exp | null
  name?: String_comparison_exp | null
  patchVersion?: numeric_comparison_exp | null
  url?: String_comparison_exp | null
}

/** Ordering options when selecting data from "WorkflowModuleType". */
export interface WorkflowModuleType_order_by {
  beacon?: order_by | null
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  majorVersion?: order_by | null
  minorVersion?: order_by | null
  name?: order_by | null
  patchVersion?: order_by | null
  url?: order_by | null
}

/** Streaming cursor of the table "WorkflowModuleType" */
export interface WorkflowModuleType_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: WorkflowModuleType_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface WorkflowModuleType_stream_cursor_value_input {
  beacon?: Scalars['String'] | null
  chainId?: Scalars['Int'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  id?: Scalars['String'] | null
  majorVersion?: Scalars['numeric'] | null
  minorVersion?: Scalars['numeric'] | null
  name?: Scalars['String'] | null
  patchVersion?: Scalars['numeric'] | null
  url?: Scalars['String'] | null
}

/** Boolean expression to filter rows from the table "WorkflowModule". All fields are combined with a logical 'AND'. */
export interface WorkflowModule_bool_exp {
  _and?: WorkflowModule_bool_exp[] | null
  _not?: WorkflowModule_bool_exp | null
  _or?: WorkflowModule_bool_exp[] | null
  chainId?: Int_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  id?: String_comparison_exp | null
  moduleType?: WorkflowModuleType_bool_exp | null
  moduleType_id?: String_comparison_exp | null
  orchestrator?: String_comparison_exp | null
}

/** Ordering options when selecting data from "WorkflowModule". */
export interface WorkflowModule_order_by {
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  id?: order_by | null
  moduleType?: WorkflowModuleType_order_by | null
  moduleType_id?: order_by | null
  orchestrator?: order_by | null
}

/** Streaming cursor of the table "WorkflowModule" */
export interface WorkflowModule_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: WorkflowModule_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface WorkflowModule_stream_cursor_value_input {
  chainId?: Scalars['Int'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  id?: Scalars['String'] | null
  moduleType_id?: Scalars['String'] | null
  orchestrator?: Scalars['String'] | null
}

/** Boolean expression to filter rows from the table "Workflow". All fields are combined with a logical 'AND'. */
export interface Workflow_bool_exp {
  _and?: Workflow_bool_exp[] | null
  _not?: Workflow_bool_exp | null
  _or?: Workflow_bool_exp[] | null
  authorizer?: WorkflowModule_bool_exp | null
  authorizer_id?: String_comparison_exp | null
  chainId?: Int_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  fundingManager?: WorkflowModule_bool_exp | null
  fundingManager_id?: String_comparison_exp | null
  id?: String_comparison_exp | null
  optionalModules?: String_array_comparison_exp | null
  orchestratorId?: numeric_comparison_exp | null
  paymentProcessor?: WorkflowModule_bool_exp | null
  paymentProcessor_id?: String_comparison_exp | null
}

/** Ordering options when selecting data from "Workflow". */
export interface Workflow_order_by {
  authorizer?: WorkflowModule_order_by | null
  authorizer_id?: order_by | null
  chainId?: order_by | null
  db_write_timestamp?: order_by | null
  fundingManager?: WorkflowModule_order_by | null
  fundingManager_id?: order_by | null
  id?: order_by | null
  optionalModules?: order_by | null
  orchestratorId?: order_by | null
  paymentProcessor?: WorkflowModule_order_by | null
  paymentProcessor_id?: order_by | null
}

/** Streaming cursor of the table "Workflow" */
export interface Workflow_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: Workflow_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface Workflow_stream_cursor_value_input {
  authorizer_id?: Scalars['String'] | null
  chainId?: Scalars['Int'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  fundingManager_id?: Scalars['String'] | null
  id?: Scalars['String'] | null
  optionalModules?: Scalars['String'][] | null
  orchestratorId?: Scalars['numeric'] | null
  paymentProcessor_id?: Scalars['String'] | null
}

/** columns and relationships of "chain_metadata" */
export interface chain_metadataGenqlSelection {
  block_height?: boolean | number
  chain_id?: boolean | number
  end_block?: boolean | number
  first_event_block_number?: boolean | number
  is_hyper_sync?: boolean | number
  latest_fetched_block_number?: boolean | number
  latest_processed_block?: boolean | number
  num_batches_fetched?: boolean | number
  num_events_processed?: boolean | number
  start_block?: boolean | number
  timestamp_caught_up_to_head_or_endblock?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "chain_metadata". All fields are combined with a logical 'AND'. */
export interface chain_metadata_bool_exp {
  _and?: chain_metadata_bool_exp[] | null
  _not?: chain_metadata_bool_exp | null
  _or?: chain_metadata_bool_exp[] | null
  block_height?: Int_comparison_exp | null
  chain_id?: Int_comparison_exp | null
  end_block?: Int_comparison_exp | null
  first_event_block_number?: Int_comparison_exp | null
  is_hyper_sync?: Boolean_comparison_exp | null
  latest_fetched_block_number?: Int_comparison_exp | null
  latest_processed_block?: Int_comparison_exp | null
  num_batches_fetched?: Int_comparison_exp | null
  num_events_processed?: Int_comparison_exp | null
  start_block?: Int_comparison_exp | null
  timestamp_caught_up_to_head_or_endblock?: timestamptz_comparison_exp | null
}

/** Ordering options when selecting data from "chain_metadata". */
export interface chain_metadata_order_by {
  block_height?: order_by | null
  chain_id?: order_by | null
  end_block?: order_by | null
  first_event_block_number?: order_by | null
  is_hyper_sync?: order_by | null
  latest_fetched_block_number?: order_by | null
  latest_processed_block?: order_by | null
  num_batches_fetched?: order_by | null
  num_events_processed?: order_by | null
  start_block?: order_by | null
  timestamp_caught_up_to_head_or_endblock?: order_by | null
}

/** Streaming cursor of the table "chain_metadata" */
export interface chain_metadata_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: chain_metadata_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface chain_metadata_stream_cursor_value_input {
  block_height?: Scalars['Int'] | null
  chain_id?: Scalars['Int'] | null
  end_block?: Scalars['Int'] | null
  first_event_block_number?: Scalars['Int'] | null
  is_hyper_sync?: Scalars['Boolean'] | null
  latest_fetched_block_number?: Scalars['Int'] | null
  latest_processed_block?: Scalars['Int'] | null
  num_batches_fetched?: Scalars['Int'] | null
  num_events_processed?: Scalars['Int'] | null
  start_block?: Scalars['Int'] | null
  timestamp_caught_up_to_head_or_endblock?: Scalars['timestamptz'] | null
}

/** Boolean expression to compare columns of type "contract_type". All fields are combined with logical 'AND'. */
export interface contract_type_comparison_exp {
  _eq?: Scalars['contract_type'] | null
  _gt?: Scalars['contract_type'] | null
  _gte?: Scalars['contract_type'] | null
  _in?: Scalars['contract_type'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['contract_type'] | null
  _lte?: Scalars['contract_type'] | null
  _neq?: Scalars['contract_type'] | null
  _nin?: Scalars['contract_type'][] | null
}

/** columns and relationships of "dynamic_contract_registry" */
export interface dynamic_contract_registryGenqlSelection {
  chain_id?: boolean | number
  contract_address?: boolean | number
  contract_type?: boolean | number
  id?: boolean | number
  registering_event_block_number?: boolean | number
  registering_event_block_timestamp?: boolean | number
  registering_event_contract_name?: boolean | number
  registering_event_log_index?: boolean | number
  registering_event_name?: boolean | number
  registering_event_src_address?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "dynamic_contract_registry". All fields are combined with a logical 'AND'. */
export interface dynamic_contract_registry_bool_exp {
  _and?: dynamic_contract_registry_bool_exp[] | null
  _not?: dynamic_contract_registry_bool_exp | null
  _or?: dynamic_contract_registry_bool_exp[] | null
  chain_id?: Int_comparison_exp | null
  contract_address?: String_comparison_exp | null
  contract_type?: contract_type_comparison_exp | null
  id?: String_comparison_exp | null
  registering_event_block_number?: Int_comparison_exp | null
  registering_event_block_timestamp?: Int_comparison_exp | null
  registering_event_contract_name?: String_comparison_exp | null
  registering_event_log_index?: Int_comparison_exp | null
  registering_event_name?: String_comparison_exp | null
  registering_event_src_address?: String_comparison_exp | null
}

/** Ordering options when selecting data from "dynamic_contract_registry". */
export interface dynamic_contract_registry_order_by {
  chain_id?: order_by | null
  contract_address?: order_by | null
  contract_type?: order_by | null
  id?: order_by | null
  registering_event_block_number?: order_by | null
  registering_event_block_timestamp?: order_by | null
  registering_event_contract_name?: order_by | null
  registering_event_log_index?: order_by | null
  registering_event_name?: order_by | null
  registering_event_src_address?: order_by | null
}

/** Streaming cursor of the table "dynamic_contract_registry" */
export interface dynamic_contract_registry_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: dynamic_contract_registry_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface dynamic_contract_registry_stream_cursor_value_input {
  chain_id?: Scalars['Int'] | null
  contract_address?: Scalars['String'] | null
  contract_type?: Scalars['contract_type'] | null
  id?: Scalars['String'] | null
  registering_event_block_number?: Scalars['Int'] | null
  registering_event_block_timestamp?: Scalars['Int'] | null
  registering_event_contract_name?: Scalars['String'] | null
  registering_event_log_index?: Scalars['Int'] | null
  registering_event_name?: Scalars['String'] | null
  registering_event_src_address?: Scalars['String'] | null
}

/** columns and relationships of "end_of_block_range_scanned_data" */
export interface end_of_block_range_scanned_dataGenqlSelection {
  block_hash?: boolean | number
  block_number?: boolean | number
  block_timestamp?: boolean | number
  chain_id?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "end_of_block_range_scanned_data". All fields are combined with a logical 'AND'. */
export interface end_of_block_range_scanned_data_bool_exp {
  _and?: end_of_block_range_scanned_data_bool_exp[] | null
  _not?: end_of_block_range_scanned_data_bool_exp | null
  _or?: end_of_block_range_scanned_data_bool_exp[] | null
  block_hash?: String_comparison_exp | null
  block_number?: Int_comparison_exp | null
  block_timestamp?: Int_comparison_exp | null
  chain_id?: Int_comparison_exp | null
}

/** Ordering options when selecting data from "end_of_block_range_scanned_data". */
export interface end_of_block_range_scanned_data_order_by {
  block_hash?: order_by | null
  block_number?: order_by | null
  block_timestamp?: order_by | null
  chain_id?: order_by | null
}

/** Streaming cursor of the table "end_of_block_range_scanned_data" */
export interface end_of_block_range_scanned_data_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: end_of_block_range_scanned_data_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface end_of_block_range_scanned_data_stream_cursor_value_input {
  block_hash?: Scalars['String'] | null
  block_number?: Scalars['Int'] | null
  block_timestamp?: Scalars['Int'] | null
  chain_id?: Scalars['Int'] | null
}

/** columns and relationships of "event_sync_state" */
export interface event_sync_stateGenqlSelection {
  block_number?: boolean | number
  block_timestamp?: boolean | number
  chain_id?: boolean | number
  is_pre_registering_dynamic_contracts?: boolean | number
  log_index?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "event_sync_state". All fields are combined with a logical 'AND'. */
export interface event_sync_state_bool_exp {
  _and?: event_sync_state_bool_exp[] | null
  _not?: event_sync_state_bool_exp | null
  _or?: event_sync_state_bool_exp[] | null
  block_number?: Int_comparison_exp | null
  block_timestamp?: Int_comparison_exp | null
  chain_id?: Int_comparison_exp | null
  is_pre_registering_dynamic_contracts?: Boolean_comparison_exp | null
  log_index?: Int_comparison_exp | null
}

/** Ordering options when selecting data from "event_sync_state". */
export interface event_sync_state_order_by {
  block_number?: order_by | null
  block_timestamp?: order_by | null
  chain_id?: order_by | null
  is_pre_registering_dynamic_contracts?: order_by | null
  log_index?: order_by | null
}

/** Streaming cursor of the table "event_sync_state" */
export interface event_sync_state_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: event_sync_state_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface event_sync_state_stream_cursor_value_input {
  block_number?: Scalars['Int'] | null
  block_timestamp?: Scalars['Int'] | null
  chain_id?: Scalars['Int'] | null
  is_pre_registering_dynamic_contracts?: Scalars['Boolean'] | null
  log_index?: Scalars['Int'] | null
}

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export interface float8_comparison_exp {
  _eq?: Scalars['float8'] | null
  _gt?: Scalars['float8'] | null
  _gte?: Scalars['float8'] | null
  _in?: Scalars['float8'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['float8'] | null
  _lte?: Scalars['float8'] | null
  _neq?: Scalars['float8'] | null
  _nin?: Scalars['float8'][] | null
}

export interface jsonb_cast_exp {
  String?: String_comparison_exp | null
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export interface jsonb_comparison_exp {
  _cast?: jsonb_cast_exp | null
  /** is the column contained in the given json value */
  _contained_in?: Scalars['jsonb'] | null
  /** does the column contain the given json value at the top level */
  _contains?: Scalars['jsonb'] | null
  _eq?: Scalars['jsonb'] | null
  _gt?: Scalars['jsonb'] | null
  _gte?: Scalars['jsonb'] | null
  /** does the string exist as a top-level key in the column */
  _has_key?: Scalars['String'] | null
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Scalars['String'][] | null
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Scalars['String'][] | null
  _in?: Scalars['jsonb'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['jsonb'] | null
  _lte?: Scalars['jsonb'] | null
  _neq?: Scalars['jsonb'] | null
  _nin?: Scalars['jsonb'][] | null
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export interface numeric_comparison_exp {
  _eq?: Scalars['numeric'] | null
  _gt?: Scalars['numeric'] | null
  _gte?: Scalars['numeric'] | null
  _in?: Scalars['numeric'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['numeric'] | null
  _lte?: Scalars['numeric'] | null
  _neq?: Scalars['numeric'] | null
  _nin?: Scalars['numeric'][] | null
}

/** columns and relationships of "persisted_state" */
export interface persisted_stateGenqlSelection {
  abi_files_hash?: boolean | number
  config_hash?: boolean | number
  envio_version?: boolean | number
  handler_files_hash?: boolean | number
  id?: boolean | number
  schema_hash?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "persisted_state". All fields are combined with a logical 'AND'. */
export interface persisted_state_bool_exp {
  _and?: persisted_state_bool_exp[] | null
  _not?: persisted_state_bool_exp | null
  _or?: persisted_state_bool_exp[] | null
  abi_files_hash?: String_comparison_exp | null
  config_hash?: String_comparison_exp | null
  envio_version?: String_comparison_exp | null
  handler_files_hash?: String_comparison_exp | null
  id?: Int_comparison_exp | null
  schema_hash?: String_comparison_exp | null
}

/** Ordering options when selecting data from "persisted_state". */
export interface persisted_state_order_by {
  abi_files_hash?: order_by | null
  config_hash?: order_by | null
  envio_version?: order_by | null
  handler_files_hash?: order_by | null
  id?: order_by | null
  schema_hash?: order_by | null
}

/** Streaming cursor of the table "persisted_state" */
export interface persisted_state_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: persisted_state_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface persisted_state_stream_cursor_value_input {
  abi_files_hash?: Scalars['String'] | null
  config_hash?: Scalars['String'] | null
  envio_version?: Scalars['String'] | null
  handler_files_hash?: Scalars['String'] | null
  id?: Scalars['Int'] | null
  schema_hash?: Scalars['String'] | null
}

export interface query_rootGenqlSelection {
  /** fetch data from the table: "BondingCurve" */
  BondingCurve?: BondingCurveGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: BondingCurve_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: BondingCurve_order_by[] | null
      /** filter the rows returned */
      where?: BondingCurve_bool_exp | null
    }
  }
  /** fetch data from the table: "BondingCurve" using primary key columns */
  BondingCurve_by_pk?: BondingCurveGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "FeeClaim" */
  FeeClaim?: FeeClaimGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: FeeClaim_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: FeeClaim_order_by[] | null
      /** filter the rows returned */
      where?: FeeClaim_bool_exp | null
    }
  }
  /** fetch data from the table: "FeeClaim" using primary key columns */
  FeeClaim_by_pk?: FeeClaimGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "LinearVesting" */
  LinearVesting?: LinearVestingGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: LinearVesting_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: LinearVesting_order_by[] | null
      /** filter the rows returned */
      where?: LinearVesting_bool_exp | null
    }
  }
  /** fetch data from the table: "LinearVesting" using primary key columns */
  LinearVesting_by_pk?: LinearVestingGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor?: StreamingPaymentProcessorGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: StreamingPaymentProcessor_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: StreamingPaymentProcessor_order_by[] | null
      /** filter the rows returned */
      where?: StreamingPaymentProcessor_bool_exp | null
    }
  }
  /** fetch data from the table: "StreamingPaymentProcessor" using primary key columns */
  StreamingPaymentProcessor_by_pk?: StreamingPaymentProcessorGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "Swap" */
  Swap?: SwapGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: Swap_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: Swap_order_by[] | null
      /** filter the rows returned */
      where?: Swap_bool_exp | null
    }
  }
  /** fetch data from the table: "Swap" using primary key columns */
  Swap_by_pk?: SwapGenqlSelection & { __args: { id: Scalars['String'] } }
  /** fetch data from the table: "Workflow" */
  Workflow?: WorkflowGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: Workflow_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: Workflow_order_by[] | null
      /** filter the rows returned */
      where?: Workflow_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModule" */
  WorkflowModule?: WorkflowModuleGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: WorkflowModule_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: WorkflowModule_order_by[] | null
      /** filter the rows returned */
      where?: WorkflowModule_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModuleType" */
  WorkflowModuleType?: WorkflowModuleTypeGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: WorkflowModuleType_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: WorkflowModuleType_order_by[] | null
      /** filter the rows returned */
      where?: WorkflowModuleType_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModuleType" using primary key columns */
  WorkflowModuleType_by_pk?: WorkflowModuleTypeGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "WorkflowModule" using primary key columns */
  WorkflowModule_by_pk?: WorkflowModuleGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "Workflow" using primary key columns */
  Workflow_by_pk?: WorkflowGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "chain_metadata" */
  chain_metadata?: chain_metadataGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: chain_metadata_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: chain_metadata_order_by[] | null
      /** filter the rows returned */
      where?: chain_metadata_bool_exp | null
    }
  }
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: chain_metadataGenqlSelection & {
    __args: { chain_id: Scalars['Int'] }
  }
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry?: dynamic_contract_registryGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: dynamic_contract_registry_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: dynamic_contract_registry_order_by[] | null
      /** filter the rows returned */
      where?: dynamic_contract_registry_bool_exp | null
    }
  }
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: dynamic_contract_registryGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data?: end_of_block_range_scanned_dataGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: end_of_block_range_scanned_data_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: end_of_block_range_scanned_data_order_by[] | null
      /** filter the rows returned */
      where?: end_of_block_range_scanned_data_bool_exp | null
    }
  }
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: end_of_block_range_scanned_dataGenqlSelection & {
    __args: { block_number: Scalars['Int']; chain_id: Scalars['Int'] }
  }
  /** fetch data from the table: "event_sync_state" */
  event_sync_state?: event_sync_stateGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: event_sync_state_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: event_sync_state_order_by[] | null
      /** filter the rows returned */
      where?: event_sync_state_bool_exp | null
    }
  }
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: event_sync_stateGenqlSelection & {
    __args: { chain_id: Scalars['Int'] }
  }
  /** fetch data from the table: "persisted_state" */
  persisted_state?: persisted_stateGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: persisted_state_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: persisted_state_order_by[] | null
      /** filter the rows returned */
      where?: persisted_state_bool_exp | null
    }
  }
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: persisted_stateGenqlSelection & {
    __args: { id: Scalars['Int'] }
  }
  /** fetch data from the table: "raw_events" */
  raw_events?: raw_eventsGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: raw_events_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: raw_events_order_by[] | null
      /** filter the rows returned */
      where?: raw_events_bool_exp | null
    }
  }
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: raw_eventsGenqlSelection & {
    __args: { serial: Scalars['Int'] }
  }
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** columns and relationships of "raw_events" */
export interface raw_eventsGenqlSelection {
  block_fields?:
    | {
        __args: {
          /** JSON select path */
          path?: Scalars['String'] | null
        }
      }
    | boolean
    | number
  block_hash?: boolean | number
  block_number?: boolean | number
  block_timestamp?: boolean | number
  chain_id?: boolean | number
  contract_name?: boolean | number
  db_write_timestamp?: boolean | number
  event_id?: boolean | number
  event_name?: boolean | number
  log_index?: boolean | number
  params?:
    | {
        __args: {
          /** JSON select path */
          path?: Scalars['String'] | null
        }
      }
    | boolean
    | number
  serial?: boolean | number
  src_address?: boolean | number
  transaction_fields?:
    | {
        __args: {
          /** JSON select path */
          path?: Scalars['String'] | null
        }
      }
    | boolean
    | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export interface raw_events_bool_exp {
  _and?: raw_events_bool_exp[] | null
  _not?: raw_events_bool_exp | null
  _or?: raw_events_bool_exp[] | null
  block_fields?: jsonb_comparison_exp | null
  block_hash?: String_comparison_exp | null
  block_number?: Int_comparison_exp | null
  block_timestamp?: Int_comparison_exp | null
  chain_id?: Int_comparison_exp | null
  contract_name?: String_comparison_exp | null
  db_write_timestamp?: timestamp_comparison_exp | null
  event_id?: numeric_comparison_exp | null
  event_name?: String_comparison_exp | null
  log_index?: Int_comparison_exp | null
  params?: jsonb_comparison_exp | null
  serial?: Int_comparison_exp | null
  src_address?: String_comparison_exp | null
  transaction_fields?: jsonb_comparison_exp | null
}

/** Ordering options when selecting data from "raw_events". */
export interface raw_events_order_by {
  block_fields?: order_by | null
  block_hash?: order_by | null
  block_number?: order_by | null
  block_timestamp?: order_by | null
  chain_id?: order_by | null
  contract_name?: order_by | null
  db_write_timestamp?: order_by | null
  event_id?: order_by | null
  event_name?: order_by | null
  log_index?: order_by | null
  params?: order_by | null
  serial?: order_by | null
  src_address?: order_by | null
  transaction_fields?: order_by | null
}

/** Streaming cursor of the table "raw_events" */
export interface raw_events_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: raw_events_stream_cursor_value_input
  /** cursor ordering */
  ordering?: cursor_ordering | null
}

/** Initial value of the column from where the streaming should start */
export interface raw_events_stream_cursor_value_input {
  block_fields?: Scalars['jsonb'] | null
  block_hash?: Scalars['String'] | null
  block_number?: Scalars['Int'] | null
  block_timestamp?: Scalars['Int'] | null
  chain_id?: Scalars['Int'] | null
  contract_name?: Scalars['String'] | null
  db_write_timestamp?: Scalars['timestamp'] | null
  event_id?: Scalars['numeric'] | null
  event_name?: Scalars['String'] | null
  log_index?: Scalars['Int'] | null
  params?: Scalars['jsonb'] | null
  serial?: Scalars['Int'] | null
  src_address?: Scalars['String'] | null
  transaction_fields?: Scalars['jsonb'] | null
}

export interface subscription_rootGenqlSelection {
  /** fetch data from the table: "BondingCurve" */
  BondingCurve?: BondingCurveGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: BondingCurve_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: BondingCurve_order_by[] | null
      /** filter the rows returned */
      where?: BondingCurve_bool_exp | null
    }
  }
  /** fetch data from the table: "BondingCurve" using primary key columns */
  BondingCurve_by_pk?: BondingCurveGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "BondingCurve" */
  BondingCurve_stream?: BondingCurveGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (BondingCurve_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: BondingCurve_bool_exp | null
    }
  }
  /** fetch data from the table: "FeeClaim" */
  FeeClaim?: FeeClaimGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: FeeClaim_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: FeeClaim_order_by[] | null
      /** filter the rows returned */
      where?: FeeClaim_bool_exp | null
    }
  }
  /** fetch data from the table: "FeeClaim" using primary key columns */
  FeeClaim_by_pk?: FeeClaimGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "FeeClaim" */
  FeeClaim_stream?: FeeClaimGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (FeeClaim_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: FeeClaim_bool_exp | null
    }
  }
  /** fetch data from the table: "LinearVesting" */
  LinearVesting?: LinearVestingGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: LinearVesting_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: LinearVesting_order_by[] | null
      /** filter the rows returned */
      where?: LinearVesting_bool_exp | null
    }
  }
  /** fetch data from the table: "LinearVesting" using primary key columns */
  LinearVesting_by_pk?: LinearVestingGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "LinearVesting" */
  LinearVesting_stream?: LinearVestingGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (LinearVesting_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: LinearVesting_bool_exp | null
    }
  }
  /** fetch data from the table: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor?: StreamingPaymentProcessorGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: StreamingPaymentProcessor_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: StreamingPaymentProcessor_order_by[] | null
      /** filter the rows returned */
      where?: StreamingPaymentProcessor_bool_exp | null
    }
  }
  /** fetch data from the table: "StreamingPaymentProcessor" using primary key columns */
  StreamingPaymentProcessor_by_pk?: StreamingPaymentProcessorGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "StreamingPaymentProcessor" */
  StreamingPaymentProcessor_stream?: StreamingPaymentProcessorGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (StreamingPaymentProcessor_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: StreamingPaymentProcessor_bool_exp | null
    }
  }
  /** fetch data from the table: "Swap" */
  Swap?: SwapGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: Swap_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: Swap_order_by[] | null
      /** filter the rows returned */
      where?: Swap_bool_exp | null
    }
  }
  /** fetch data from the table: "Swap" using primary key columns */
  Swap_by_pk?: SwapGenqlSelection & { __args: { id: Scalars['String'] } }
  /** fetch data from the table in a streaming manner: "Swap" */
  Swap_stream?: SwapGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (Swap_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: Swap_bool_exp | null
    }
  }
  /** fetch data from the table: "Workflow" */
  Workflow?: WorkflowGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: Workflow_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: Workflow_order_by[] | null
      /** filter the rows returned */
      where?: Workflow_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModule" */
  WorkflowModule?: WorkflowModuleGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: WorkflowModule_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: WorkflowModule_order_by[] | null
      /** filter the rows returned */
      where?: WorkflowModule_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModuleType" */
  WorkflowModuleType?: WorkflowModuleTypeGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: WorkflowModuleType_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: WorkflowModuleType_order_by[] | null
      /** filter the rows returned */
      where?: WorkflowModuleType_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModuleType" using primary key columns */
  WorkflowModuleType_by_pk?: WorkflowModuleTypeGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "WorkflowModuleType" */
  WorkflowModuleType_stream?: WorkflowModuleTypeGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (WorkflowModuleType_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: WorkflowModuleType_bool_exp | null
    }
  }
  /** fetch data from the table: "WorkflowModule" using primary key columns */
  WorkflowModule_by_pk?: WorkflowModuleGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "WorkflowModule" */
  WorkflowModule_stream?: WorkflowModuleGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (WorkflowModule_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: WorkflowModule_bool_exp | null
    }
  }
  /** fetch data from the table: "Workflow" using primary key columns */
  Workflow_by_pk?: WorkflowGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "Workflow" */
  Workflow_stream?: WorkflowGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (Workflow_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: Workflow_bool_exp | null
    }
  }
  /** fetch data from the table: "chain_metadata" */
  chain_metadata?: chain_metadataGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: chain_metadata_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: chain_metadata_order_by[] | null
      /** filter the rows returned */
      where?: chain_metadata_bool_exp | null
    }
  }
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: chain_metadataGenqlSelection & {
    __args: { chain_id: Scalars['Int'] }
  }
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream?: chain_metadataGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (chain_metadata_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: chain_metadata_bool_exp | null
    }
  }
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry?: dynamic_contract_registryGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: dynamic_contract_registry_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: dynamic_contract_registry_order_by[] | null
      /** filter the rows returned */
      where?: dynamic_contract_registry_bool_exp | null
    }
  }
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: dynamic_contract_registryGenqlSelection & {
    __args: { id: Scalars['String'] }
  }
  /** fetch data from the table in a streaming manner: "dynamic_contract_registry" */
  dynamic_contract_registry_stream?: dynamic_contract_registryGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (dynamic_contract_registry_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: dynamic_contract_registry_bool_exp | null
    }
  }
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data?: end_of_block_range_scanned_dataGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: end_of_block_range_scanned_data_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: end_of_block_range_scanned_data_order_by[] | null
      /** filter the rows returned */
      where?: end_of_block_range_scanned_data_bool_exp | null
    }
  }
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: end_of_block_range_scanned_dataGenqlSelection & {
    __args: { block_number: Scalars['Int']; chain_id: Scalars['Int'] }
  }
  /** fetch data from the table in a streaming manner: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data_stream?: end_of_block_range_scanned_dataGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (end_of_block_range_scanned_data_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: end_of_block_range_scanned_data_bool_exp | null
    }
  }
  /** fetch data from the table: "event_sync_state" */
  event_sync_state?: event_sync_stateGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: event_sync_state_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: event_sync_state_order_by[] | null
      /** filter the rows returned */
      where?: event_sync_state_bool_exp | null
    }
  }
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: event_sync_stateGenqlSelection & {
    __args: { chain_id: Scalars['Int'] }
  }
  /** fetch data from the table in a streaming manner: "event_sync_state" */
  event_sync_state_stream?: event_sync_stateGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (event_sync_state_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: event_sync_state_bool_exp | null
    }
  }
  /** fetch data from the table: "persisted_state" */
  persisted_state?: persisted_stateGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: persisted_state_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: persisted_state_order_by[] | null
      /** filter the rows returned */
      where?: persisted_state_bool_exp | null
    }
  }
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: persisted_stateGenqlSelection & {
    __args: { id: Scalars['Int'] }
  }
  /** fetch data from the table in a streaming manner: "persisted_state" */
  persisted_state_stream?: persisted_stateGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (persisted_state_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: persisted_state_bool_exp | null
    }
  }
  /** fetch data from the table: "raw_events" */
  raw_events?: raw_eventsGenqlSelection & {
    __args?: {
      /** distinct select on columns */
      distinct_on?: raw_events_select_column[] | null
      /** limit the number of rows returned */
      limit?: Scalars['Int'] | null
      /** skip the first n rows. Use only with order_by */
      offset?: Scalars['Int'] | null
      /** sort the rows by one or more columns */
      order_by?: raw_events_order_by[] | null
      /** filter the rows returned */
      where?: raw_events_bool_exp | null
    }
  }
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: raw_eventsGenqlSelection & {
    __args: { serial: Scalars['Int'] }
  }
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream?: raw_eventsGenqlSelection & {
    __args: {
      /** maximum number of rows returned in a single batch */
      batch_size: Scalars['Int']
      /** cursor to stream the results returned by the query */
      cursor: (raw_events_stream_cursor_input | null)[]
      /** filter the rows returned */
      where?: raw_events_bool_exp | null
    }
  }
  __typename?: boolean | number
  __scalar?: boolean | number
}

/** Boolean expression to compare columns of type "swaptype". All fields are combined with logical 'AND'. */
export interface swaptype_comparison_exp {
  _eq?: Scalars['swaptype'] | null
  _gt?: Scalars['swaptype'] | null
  _gte?: Scalars['swaptype'] | null
  _in?: Scalars['swaptype'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['swaptype'] | null
  _lte?: Scalars['swaptype'] | null
  _neq?: Scalars['swaptype'] | null
  _nin?: Scalars['swaptype'][] | null
}

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export interface timestamp_comparison_exp {
  _eq?: Scalars['timestamp'] | null
  _gt?: Scalars['timestamp'] | null
  _gte?: Scalars['timestamp'] | null
  _in?: Scalars['timestamp'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['timestamp'] | null
  _lte?: Scalars['timestamp'] | null
  _neq?: Scalars['timestamp'] | null
  _nin?: Scalars['timestamp'][] | null
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export interface timestamptz_comparison_exp {
  _eq?: Scalars['timestamptz'] | null
  _gt?: Scalars['timestamptz'] | null
  _gte?: Scalars['timestamptz'] | null
  _in?: Scalars['timestamptz'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['timestamptz'] | null
  _lte?: Scalars['timestamptz'] | null
  _neq?: Scalars['timestamptz'] | null
  _nin?: Scalars['timestamptz'][] | null
}

/** Boolean expression to compare columns of type "vestingstatus". All fields are combined with logical 'AND'. */
export interface vestingstatus_comparison_exp {
  _eq?: Scalars['vestingstatus'] | null
  _gt?: Scalars['vestingstatus'] | null
  _gte?: Scalars['vestingstatus'] | null
  _in?: Scalars['vestingstatus'][] | null
  _is_null?: Scalars['Boolean'] | null
  _lt?: Scalars['vestingstatus'] | null
  _lte?: Scalars['vestingstatus'] | null
  _neq?: Scalars['vestingstatus'] | null
  _nin?: Scalars['vestingstatus'][] | null
}

export type QueryGenqlSelection = query_rootGenqlSelection
export type SubscriptionGenqlSelection = subscription_rootGenqlSelection

const BondingCurve_possibleTypes: string[] = ['BondingCurve']
export const isBondingCurve = (
  obj?: { __typename?: any } | null
): obj is BondingCurve => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isBondingCurve"')
  return BondingCurve_possibleTypes.includes(obj.__typename)
}

const FeeClaim_possibleTypes: string[] = ['FeeClaim']
export const isFeeClaim = (
  obj?: { __typename?: any } | null
): obj is FeeClaim => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isFeeClaim"')
  return FeeClaim_possibleTypes.includes(obj.__typename)
}

const LinearVesting_possibleTypes: string[] = ['LinearVesting']
export const isLinearVesting = (
  obj?: { __typename?: any } | null
): obj is LinearVesting => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isLinearVesting"')
  return LinearVesting_possibleTypes.includes(obj.__typename)
}

const StreamingPaymentProcessor_possibleTypes: string[] = [
  'StreamingPaymentProcessor',
]
export const isStreamingPaymentProcessor = (
  obj?: { __typename?: any } | null
): obj is StreamingPaymentProcessor => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isStreamingPaymentProcessor"')
  return StreamingPaymentProcessor_possibleTypes.includes(obj.__typename)
}

const Swap_possibleTypes: string[] = ['Swap']
export const isSwap = (obj?: { __typename?: any } | null): obj is Swap => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isSwap"')
  return Swap_possibleTypes.includes(obj.__typename)
}

const Workflow_possibleTypes: string[] = ['Workflow']
export const isWorkflow = (
  obj?: { __typename?: any } | null
): obj is Workflow => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isWorkflow"')
  return Workflow_possibleTypes.includes(obj.__typename)
}

const WorkflowModule_possibleTypes: string[] = ['WorkflowModule']
export const isWorkflowModule = (
  obj?: { __typename?: any } | null
): obj is WorkflowModule => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isWorkflowModule"')
  return WorkflowModule_possibleTypes.includes(obj.__typename)
}

const WorkflowModuleType_possibleTypes: string[] = ['WorkflowModuleType']
export const isWorkflowModuleType = (
  obj?: { __typename?: any } | null
): obj is WorkflowModuleType => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isWorkflowModuleType"')
  return WorkflowModuleType_possibleTypes.includes(obj.__typename)
}

const chain_metadata_possibleTypes: string[] = ['chain_metadata']
export const ischain_metadata = (
  obj?: { __typename?: any } | null
): obj is chain_metadata => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "ischain_metadata"')
  return chain_metadata_possibleTypes.includes(obj.__typename)
}

const dynamic_contract_registry_possibleTypes: string[] = [
  'dynamic_contract_registry',
]
export const isdynamic_contract_registry = (
  obj?: { __typename?: any } | null
): obj is dynamic_contract_registry => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isdynamic_contract_registry"')
  return dynamic_contract_registry_possibleTypes.includes(obj.__typename)
}

const end_of_block_range_scanned_data_possibleTypes: string[] = [
  'end_of_block_range_scanned_data',
]
export const isend_of_block_range_scanned_data = (
  obj?: { __typename?: any } | null
): obj is end_of_block_range_scanned_data => {
  if (!obj?.__typename)
    throw new Error(
      '__typename is missing in "isend_of_block_range_scanned_data"'
    )
  return end_of_block_range_scanned_data_possibleTypes.includes(obj.__typename)
}

const event_sync_state_possibleTypes: string[] = ['event_sync_state']
export const isevent_sync_state = (
  obj?: { __typename?: any } | null
): obj is event_sync_state => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isevent_sync_state"')
  return event_sync_state_possibleTypes.includes(obj.__typename)
}

const persisted_state_possibleTypes: string[] = ['persisted_state']
export const ispersisted_state = (
  obj?: { __typename?: any } | null
): obj is persisted_state => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "ispersisted_state"')
  return persisted_state_possibleTypes.includes(obj.__typename)
}

const query_root_possibleTypes: string[] = ['query_root']
export const isquery_root = (
  obj?: { __typename?: any } | null
): obj is query_root => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "isquery_root"')
  return query_root_possibleTypes.includes(obj.__typename)
}

const raw_events_possibleTypes: string[] = ['raw_events']
export const israw_events = (
  obj?: { __typename?: any } | null
): obj is raw_events => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "israw_events"')
  return raw_events_possibleTypes.includes(obj.__typename)
}

const subscription_root_possibleTypes: string[] = ['subscription_root']
export const issubscription_root = (
  obj?: { __typename?: any } | null
): obj is subscription_root => {
  if (!obj?.__typename)
    throw new Error('__typename is missing in "issubscription_root"')
  return subscription_root_possibleTypes.includes(obj.__typename)
}

export const enumBondingCurveSelectColumn = {
  bcType: 'bcType' as const,
  buyFee: 'buyFee' as const,
  buyReserveRatio: 'buyReserveRatio' as const,
  chainId: 'chainId' as const,
  collateralToken: 'collateralToken' as const,
  collateralTokenDecimals: 'collateralTokenDecimals' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  id: 'id' as const,
  issuanceToken: 'issuanceToken' as const,
  issuanceTokenDecimals: 'issuanceTokenDecimals' as const,
  sellFee: 'sellFee' as const,
  sellReserveRatio: 'sellReserveRatio' as const,
  virtualCollateral: 'virtualCollateral' as const,
  virtualCollateralRaw: 'virtualCollateralRaw' as const,
  virtualIssuance: 'virtualIssuance' as const,
  workflow_id: 'workflow_id' as const,
}

export const enumFeeClaimSelectColumn = {
  amount: 'amount' as const,
  blockTimestamp: 'blockTimestamp' as const,
  bondingCurve_id: 'bondingCurve_id' as const,
  chainId: 'chainId' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  id: 'id' as const,
  recipient: 'recipient' as const,
}

export const enumLinearVestingSelectColumn = {
  amountRaw: 'amountRaw' as const,
  blockTimestamp: 'blockTimestamp' as const,
  chainId: 'chainId' as const,
  cliff: 'cliff' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  end: 'end' as const,
  id: 'id' as const,
  recipient: 'recipient' as const,
  start: 'start' as const,
  status: 'status' as const,
  streamingPaymentProcessor_id: 'streamingPaymentProcessor_id' as const,
  token: 'token' as const,
}

export const enumStreamingPaymentProcessorSelectColumn = {
  chainId: 'chainId' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  id: 'id' as const,
  workflow_id: 'workflow_id' as const,
}

export const enumSwapSelectColumn = {
  blockTimestamp: 'blockTimestamp' as const,
  bondingCurve_id: 'bondingCurve_id' as const,
  chainId: 'chainId' as const,
  collateralAmount: 'collateralAmount' as const,
  collateralToken: 'collateralToken' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  id: 'id' as const,
  initiator: 'initiator' as const,
  issuanceAmount: 'issuanceAmount' as const,
  issuanceToken: 'issuanceToken' as const,
  priceInCol: 'priceInCol' as const,
  recipient: 'recipient' as const,
  swapType: 'swapType' as const,
}

export const enumWorkflowModuleTypeSelectColumn = {
  beacon: 'beacon' as const,
  chainId: 'chainId' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  id: 'id' as const,
  majorVersion: 'majorVersion' as const,
  minorVersion: 'minorVersion' as const,
  name: 'name' as const,
  patchVersion: 'patchVersion' as const,
  url: 'url' as const,
}

export const enumWorkflowModuleSelectColumn = {
  chainId: 'chainId' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  id: 'id' as const,
  moduleType_id: 'moduleType_id' as const,
  orchestrator: 'orchestrator' as const,
}

export const enumWorkflowSelectColumn = {
  authorizer_id: 'authorizer_id' as const,
  chainId: 'chainId' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  fundingManager_id: 'fundingManager_id' as const,
  id: 'id' as const,
  optionalModules: 'optionalModules' as const,
  orchestratorId: 'orchestratorId' as const,
  paymentProcessor_id: 'paymentProcessor_id' as const,
}

export const enumChainMetadataSelectColumn = {
  block_height: 'block_height' as const,
  chain_id: 'chain_id' as const,
  end_block: 'end_block' as const,
  first_event_block_number: 'first_event_block_number' as const,
  is_hyper_sync: 'is_hyper_sync' as const,
  latest_fetched_block_number: 'latest_fetched_block_number' as const,
  latest_processed_block: 'latest_processed_block' as const,
  num_batches_fetched: 'num_batches_fetched' as const,
  num_events_processed: 'num_events_processed' as const,
  start_block: 'start_block' as const,
  timestamp_caught_up_to_head_or_endblock:
    'timestamp_caught_up_to_head_or_endblock' as const,
}

export const enumCursorOrdering = {
  ASC: 'ASC' as const,
  DESC: 'DESC' as const,
}

export const enumDynamicContractRegistrySelectColumn = {
  chain_id: 'chain_id' as const,
  contract_address: 'contract_address' as const,
  contract_type: 'contract_type' as const,
  id: 'id' as const,
  registering_event_block_number: 'registering_event_block_number' as const,
  registering_event_block_timestamp:
    'registering_event_block_timestamp' as const,
  registering_event_contract_name: 'registering_event_contract_name' as const,
  registering_event_log_index: 'registering_event_log_index' as const,
  registering_event_name: 'registering_event_name' as const,
  registering_event_src_address: 'registering_event_src_address' as const,
}

export const enumEndOfBlockRangeScannedDataSelectColumn = {
  block_hash: 'block_hash' as const,
  block_number: 'block_number' as const,
  block_timestamp: 'block_timestamp' as const,
  chain_id: 'chain_id' as const,
}

export const enumEventSyncStateSelectColumn = {
  block_number: 'block_number' as const,
  block_timestamp: 'block_timestamp' as const,
  chain_id: 'chain_id' as const,
  is_pre_registering_dynamic_contracts:
    'is_pre_registering_dynamic_contracts' as const,
  log_index: 'log_index' as const,
}

export const enumOrderBy = {
  asc: 'asc' as const,
  asc_nulls_first: 'asc_nulls_first' as const,
  asc_nulls_last: 'asc_nulls_last' as const,
  desc: 'desc' as const,
  desc_nulls_first: 'desc_nulls_first' as const,
  desc_nulls_last: 'desc_nulls_last' as const,
}

export const enumPersistedStateSelectColumn = {
  abi_files_hash: 'abi_files_hash' as const,
  config_hash: 'config_hash' as const,
  envio_version: 'envio_version' as const,
  handler_files_hash: 'handler_files_hash' as const,
  id: 'id' as const,
  schema_hash: 'schema_hash' as const,
}

export const enumRawEventsSelectColumn = {
  block_fields: 'block_fields' as const,
  block_hash: 'block_hash' as const,
  block_number: 'block_number' as const,
  block_timestamp: 'block_timestamp' as const,
  chain_id: 'chain_id' as const,
  contract_name: 'contract_name' as const,
  db_write_timestamp: 'db_write_timestamp' as const,
  event_id: 'event_id' as const,
  event_name: 'event_name' as const,
  log_index: 'log_index' as const,
  params: 'params' as const,
  serial: 'serial' as const,
  src_address: 'src_address' as const,
  transaction_fields: 'transaction_fields' as const,
}
