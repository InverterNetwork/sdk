// These Extras are used for auto filling function arguments
export type Extras = {
  walletAddress?: `0x${string}`
  decimals?: number
  defaultToken?: `0x${string}`
  issuanceTokenDecimals?: number
  issuanceToken?: `0x${string}`
}

// JsType is used for the typescript type of the function arguments
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

export type WriteOutput = {
  name: 'txHash'
  type: 'bytes32'
}[]

export type EstimateGasOutput = {
  name: 'gas'
  type: 'tuple'
  components: {
    name: 'value'
    type: 'uint256'
  }[]
}[]
