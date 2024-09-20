import { formatUnits } from 'viem'

// token with unpermissioned mint function
export const TEST_ERC20_MOCK_ADDRESS = process.env
  .TEST_ERC20_MOCK_ADDRESS as `0x${string}`
// bancor formula address for bonding curves
export const TEST_BANCOR_FORMULA_ADDRESS = process.env
  .TEST_BANCOR_FORMULA_ADDRESS as `0x${string}`
// Uint Max Supply
export const UINT_MAX_SUPPLY =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n
// Formatted Uint Max Supply
export const GET_HUMAN_READABLE_UINT_MAX_SUPPLY = (decimals: number) =>
  formatUnits(UINT_MAX_SUPPLY, decimals)
