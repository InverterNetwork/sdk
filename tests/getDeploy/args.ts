import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

export const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a' // self-deployed mock contract
export const iUSD = '0xB637cE56AFDb659AB7f85d1293e20cE661445db4' // token with unpermissioned mint function
export const deployedBcOrchestrator =
  '0x5815859FFc3cF512fDe8b65345c4698Eda0F6031'
export const deployedBcModule = '0x815f393008b8C6aD2C3AB9E7D79bb836B8c87941'

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
    formula: '0x823F6AC80759F2e037eaF706d45CB4B47b80926c',
    reserveRatioForBuying: '333333',
    reserveRatioForSelling: '333333',
    buyFee: '0',
    sellFee: '100',
    buyIsOpen: true,
    sellIsOpen: true,
    initialTokenSupply: '100',
    initialCollateralSupply: '33',
  },
  acceptedToken: USDC_SEPOLIA, //USDC
} as const