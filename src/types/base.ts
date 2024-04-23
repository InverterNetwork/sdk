// These Extras are used for auto filling function arguments
export type Extras = {
  walletAddress?: `0x${string}`
  decimals?: number
}

// JsType is used for the typescript type of the function arguments
export type JsType =
  | 'string'
  | 'boolean'
  | '0xstring'
  | 'string[]'
  | '0xstring[]'
  | 'any'
