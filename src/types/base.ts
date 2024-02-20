export const ModuleFieldCrossType = {
  address: '0xstring',
  uint256: 'numberString',
  decimals: 'numberString',
  bytes: '0xstring',
  'tuple[]': 'objectArray',
} as const

export type FormatterValues = `0x${string}` | string | object[]

export type FormatterTagValues = number
