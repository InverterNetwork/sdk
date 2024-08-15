import { USDC_SEPOLIA } from '../../src/getDeploy/constants'

export const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a' // self-deployed mock contract
export const iUSD = '0x6ce9fe09c5fa9c43fd0206f4c33a03cb11d1a179' // token with unpermissioned mint function
export const deployedBcOrchestrator =
  '0x5815859FFc3cF512fDe8b65345c4698Eda0F6031'
export const deployedBcModule = '0x815f393008b8C6aD2C3AB9E7D79bb836B8c87941'
export const deployedKpiModule = '0x395EE25214B40bF3bE4252EEDba2a78699578e95'

export const baseArgs = {
  orchestrator: {
    independentUpdates: true,
    independentUpdateAdmin: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
  },
  fundingManager: {
    orchestratorTokenAddress: iUSD,
  },
  authorizer: {
    initialAdmin: '0x7AcaF5360474b8E40f619770c7e8803cf3ED1053',
  },
} as const

export const bcArgs = {
  issuanceToken: '0x5432BbeA7895882B2CF2A0147cf6d872407f47D5',
  bondingCurveParams: {
    formula: '0x823F6AC80759F2e037eaF706d45CB4B47b80926c',
    reserveRatioForBuying: '333333',
    reserveRatioForSelling: '333333',
    buyFee: '0',
    sellFee: '100',
    buyIsOpen: true,
    sellIsOpen: true,
    initialIssuanceSupply: '100',
    initialCollateralSupply: '33',
  },
  collateralToken: USDC_SEPOLIA, //USDC
} as const

export const kpiArgs = {
  stakingTokenAddr: iUSD,
  currencyAddr: USDC_SEPOLIA,
  defaultBond: '1000',
  ooAddr: '0xFd9e2642a170aDD10F53Ee14a93FcF2F31924944',
  liveness: '10000',
} as const
