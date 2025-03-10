import type { ModuleName } from '@inverter-network/abis'
import type { FindStringByPart } from './utils'

/**
 * @description The configs for getModule, deployWorkflow functions these enable tags to calculate certain values like simulations and number formats and parses
 */
export type TagConfig = {
  walletAddress?: `0x${string}`
  decimals?: number
  defaultToken?: `0x${string}`
  issuanceTokenDecimals?: number
  issuanceToken?: `0x${string}`
}

/**
 * @description The js type conversion for evm types
 */
export type JsType =
  | 'numberString'
  | 'numberString[]'
  | 'number'
  | 'number[]'
  | 'boolean'
  | '0xstring'
  | '0xstring[]'
  | 'any'
  | 'boolean[]'

/**
 * @description The output type for the write method
 */
export type WriteOutput = {
  name: 'txHash'
  type: 'bytes32'
}[]

/**
 * @description The output type for the estimateGas method
 */
export type EstimateGasOutput = {
  name: 'gas'
  type: 'tuple'
  components: {
    name: 'value'
    type: 'uint256'
  }[]
}[]

/**
 * @description The available issuance tokens
 */
export type WorkflowIssuanceToken = FindStringByPart<
  ModuleName,
  'ERC20Issuance'
>

/**
 * @description The available workflow tokens
 */
export type WorkflowToken = WorkflowIssuanceToken | 'ERC20'
