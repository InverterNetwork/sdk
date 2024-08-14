// @ts-nocheck

import { RequestedModules, type FilterByPrefix } from '../../src'

export const testToken = '0xd5018fA63924d1BE2C2C42aBDc24bD754499F97c'

export const getBcArgs = () => {
  return {
    issuanceToken: '0x5432BbeA7895882B2CF2A0147cf6d872407f47D5',
    bondingCurveParams: {
      formula: '0x91c1538be9647946830F881Dd7c1F41E990Dbe8C',
      reserveRatioForBuying: '333333',
      reserveRatioForSelling: '333333',
      buyFee: '10',
      sellFee: '100',
      buyIsOpen: true,
      sellIsOpen: true,
      initialIssuanceSupply: '100',
      initialCollateralSupply: '33',
    },
    collateralToken: testToken, //USDC
  } as const
}

export const getAuthorizerArgs = (initialAdmin: string) => {
  return {
    initialAdmin: initialAdmin as `0x${string}`,
  }
}

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
): T['fundingManager'] extends FilterByPrefix<T['fundingManager'], 'FM_BC'>
  ? GetDeployArgsReturnBase & {
      fundingManager: ReturnType<typeof getBcArgs>
    }
  : GetDeployArgsReturnBase => {
  const { fundingManager } = requestedModules

  const args = {
    orchestrator: getOrchestratorArgs(deployer),
    authorizer: getAuthorizerArgs(deployer),
    ...(fundingManager.includes('FM_BC') && {
      fundingManager: getBcArgs(deployer),
    }),
  }

  return args
}
