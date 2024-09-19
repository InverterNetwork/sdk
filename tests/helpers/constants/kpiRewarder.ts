import { TEST_ERC20_MOCK_ADDRESS } from './base'

export const GET_KPI_ARGS = (walletAddress: string) => {
  return {
    stakingTokenAddr: TEST_ERC20_MOCK_ADDRESS,
    currencyAddr: TEST_ERC20_MOCK_ADDRESS,
    defaultBond: '1000',
    ooAddr: walletAddress as `0x${string}`,
    liveness: '10000',
  } as const
}
