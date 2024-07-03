import { RequestedModules } from "../../src"

export const testToken = '0xd5018fA63924d1BE2C2C42aBDc24bD754499F97c'

export const getBcArgs = (tokenAdmin: string) => {
 return {
    issuanceToken: {
      name: 'Test Issuance Token',
      symbol: 'TIT',
      decimals: '18',
      maxSupply: '1000000000',
    },
    tokenAdmin,
    bondingCurveParams: {
      formula: '0x823F6AC80759F2e037eaF706d45CB4B47b80926c',
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
  }
}

export const getAuthorizerArgs = (initialAdmin: string) => {
    return {
        initialAdmin,
    }
}

export const getOrchestratorArgs = (independentUpdateAdmin: `0x${string}` | string = "") => {
  return independentUpdateAdmin ? {
    independentUpdates: true,
    independentUpdateAdmin,
  } : {
    independentUpdates: false,
    independentUpdateAdmin: '0x0000000000000000000000000000000000000000',
  }
}

export const getDeployArgs = (requestedModules: RequestedModules, deployer: string) => {
  const args = {}
  const {fundingManager} = requestedModules
  args["orchestrator"] = getOrchestratorArgs(deployer)
  args["authorizer"] = getAuthorizerArgs(deployer)

  if(["FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1", "FM_BC_Bancor_Redeeming_VirtualSupply_v1"].includes(fundingManager)) {
    args["fundingManager"] = getBcArgs(deployer)
  }

  return args
}