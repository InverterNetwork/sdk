import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

export const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a' as Hex // self-deployed mock contract

export const baseArgs = {
  orchestrator: {
    owner: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
    token: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
  },
  fundingManager: {
    orchestratorTokenAddress: '0x5eb14c2e7D0cD925327d74ae4ce3fC692ff8ABEF',
  },
  authorizer: {
    initialOwner: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
    initialManager: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
  },
} as const

export const bcArgs = {
  issuanceToken: {
    name: 'Project Issuance Token',
    symbol: 'QACC',
    decimals: '18',
    maxSupply: '115792',
  },
  tokenAdmin: mockAddress,
  bondingCurveParams: {
    formula: mockAddress,
    reserveRatioForBuying: '333333',
    reserveRatioForSelling: '333333',
    buyFee: '0',
    sellFee: '100',
    buyIsOpen: true,
    sellIsOpen: false,
    initialTokenSupply: '100',
    initialCollateralSupply: '33',
  },
  acceptedToken: USDC_SEPOLIA, //USDC
} as const
