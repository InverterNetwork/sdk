// These args are used to deploy the contracts in the tests
// !IMPORTANT! Make sure to use OPTIMISM_SEPOLIA

import type { Merge } from 'type-fest-4'
import type { RequestedModules, FilterByPrefix } from '../../src'

export const curveShape = {
  Basic: {
    reserveRatioForBuying: 333_333,
    reserveRatioForSelling: 333_333,
    buyIsOpen: true,
    sellIsOpen: true,
    initialIssuanceSupply: '200002.999999999999998676',
    initialCollateralSupply: '296.306333665498798599',
  },
} as const

export const iUSD = '0xd5018fA63924d1BE2C2C42aBDc24bD754499F97c' as const // token with unpermissioned mint function
export const bancorFormula =
  '0xe9dD0B0345c0ed96a8a7f9fC0090d63156417E2B' as const
export const deployedBcModule =
  '0x815f393008b8C6aD2C3AB9E7D79bb836B8c87941' as const
export const deployedKpiModule =
  '0x395EE25214B40bF3bE4252EEDba2a78699578e95' as const
// this orchestrator belongs to mguleryuz test account
export const deployedBcOrchestrator =
  '0xa2bc1f4764419118700A1a62213bC559bDDd067D' as const
export const deployedBCFundingManager =
  '0xCdF64Fc3846D5aEb3158fc24418Df5401C1aAa5B' as const

export const simpleFMArgs = {
  orchestratorTokenAddress: iUSD,
} as const

export const bcArgs = {
  issuanceToken: '0x5432BbeA7895882B2CF2A0147cf6d872407f47D5',
  bondingCurveParams: {
    formula: bancorFormula,
    buyFee: '10',
    sellFee: '100',
    ...curveShape.Basic,
  },
  collateralToken: iUSD,
} as const

export const getKpiArgs = (walletAddress: string) =>
  ({
    stakingTokenAddr: iUSD,
    currencyAddr: iUSD,
    defaultBond: '1000',
    ooAddr: walletAddress as `0x${string}`,
    liveness: '10000',
  }) as const

export const getAuthorizerArgs = (initialAdmin: string) => ({
  initialAdmin: initialAdmin as `0x${string}`,
})

export const getOrchestratorArgs = (
  independentUpdateAdmin: `0x${string}` | string = ''
) => {
  const admin = <`0x${string}`>independentUpdateAdmin

  return independentUpdateAdmin
    ? ({
        independentUpdates: true,
        independentUpdateAdmin: admin,
      } as const)
    : ({
        independentUpdates: false,
        independentUpdateAdmin: '0x0000000000000000000000000000000000000000',
      } as const)
}

type GetDeployArgsReturnBase = {
  orchestrator: ReturnType<typeof getOrchestratorArgs>
  authorizer: ReturnType<typeof getAuthorizerArgs>
}

export const getDeployArgs = <T extends RequestedModules>(
  requestedModules: T,
  deployer: string
): Merge<
  GetDeployArgsReturnBase,
  Merge<
    T['fundingManager'] extends FilterByPrefix<T['fundingManager'], 'FM_BC'>
      ? {
          fundingManager: typeof bcArgs
        }
      : {
          fundingManager: typeof simpleFMArgs
        },
    FilterByPrefix<
      NonNullable<T['optionalModules']>[number],
      'LM_PC_KPI'
    > extends string
      ? ReturnType<typeof getKpiArgs>
      : never
  >
> => {
  const { fundingManager, optionalModules } = requestedModules

  const kpi = optionalModules?.find((module) =>
    module.includes('LM_PC_KPI')
  ) as
    | FilterByPrefix<NonNullable<T['optionalModules']>[number], 'LM_PC_KPI'>
    | undefined

  const args = {
    orchestrator: getOrchestratorArgs(deployer),
    authorizer: getAuthorizerArgs(deployer),
    fundingManager: fundingManager.includes('FM_BC') ? bcArgs : simpleFMArgs,
    ...(!!kpi && {
      optionalModules: {
        [kpi]: getKpiArgs(deployer),
      },
    }),
  }

  return args as any
}
