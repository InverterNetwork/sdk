import { TEST_BANCOR_FORMULA_ADDRESS, TEST_ERC20_MOCK_ADDRESS } from './base'

export const FM_BC_Bancor_VirtualSupply_v1_ARGS = {
  issuanceToken: TEST_ERC20_MOCK_ADDRESS,
  bondingCurveParams: {
    formula: TEST_BANCOR_FORMULA_ADDRESS,
    buyFee: '10',
    sellFee: '100',
    reserveRatioForBuying: 333_333,
    reserveRatioForSelling: 333_333,
    buyIsOpen: true,
    sellIsOpen: true,
    initialIssuanceSupply: '200002.999999999999998676',
    initialCollateralSupply: '296.306333665498798599',
  },
  collateralToken: TEST_ERC20_MOCK_ADDRESS,
} as const

const { issuanceToken, ...CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS } =
  FM_BC_Bancor_VirtualSupply_v1_ARGS

export { CUSTOM_PIM_FM_BC_Bancor_VirtualSupply_v1_ARGS }
