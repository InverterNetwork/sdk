import { formatUnits } from 'viem'

// default factory address
export const TEST_ORCHESTRATOR_FACTORY_ADDRESS = process.env
  .TEST_ORCHESTRATOR_FACTORY_ADDRESS as `0x${string}`
// restricted pim factory address
export const TEST_RESTRICTED_PIM_FACTORY_ADDRESS = process.env
  .TEST_RESTRICTED_PIM_FACTORY_ADDRESS as `0x${string}`
// immutable pim factory address
export const TEST_IMMUTABLE_PIM_FACTORY_ADDRESS = process.env
  .TEST_IMMUTABLE_PIM_FACTORY_ADDRESS as `0x${string}`
// migrating pim factory address
export const TEST_MIGRATING_PIM_FACTORY_ADDRESS = process.env
  .TEST_MIGRATING_PIM_FACTORY_ADDRESS as `0x${string}`
// token with unpermissioned mint function
export const TEST_ERC20_MOCK_ADDRESS = process.env
  .TEST_ERC20_MOCK_ADDRESS as `0x${string}`
// bancor formula address for bonding curves
export const TEST_BANCOR_FORMULA_ADDRESS = process.env
  .TEST_BANCOR_FORMULA_ADDRESS as `0x${string}`
// migrator payment router address
export const TEST_UNISWAP_V2_ADAPTER_ADDRESS = process.env
  .TEST_UNISWAP_V2_ADAPTER_ADDRESS as `0x${string}`
// trusted forwarder address
export const TRUSTED_FORWARDER_ADDRESS = process.env
  .TRUSTED_FORWARDER_ADDRESS as `0x${string}`
// Uint Max Supply
export const UINT_MAX_SUPPLY =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n
// Formatted Uint Max Supply
export const GET_HUMAN_READABLE_UINT_MAX_SUPPLY = (decimals: number) =>
  formatUnits(UINT_MAX_SUPPLY, decimals)
