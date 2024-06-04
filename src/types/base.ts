// These Extras are used for auto filling function arguments
export type Extras = {
  walletAddress?: `0x${string}`
  decimals?: number
}

// JsType is used for the typescript type of the function arguments
export type JsType =
  | 'numberString'
  | 'numberString[]'
  | 'boolean'
  | '0xstring'
  | '0xstring[]'
  | 'any'
  | 'boolean[]'
