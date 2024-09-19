import { expect, describe, it } from 'bun:test'
import {
  TEST_BANCOR_FORMULA_ADDRESS,
  TEST_ERC20_MOCK_ADDRESS,
  sdk,
} from 'tests/helpers'
import { processInputs } from '@/utils'
import { getModuleData } from '@inverter-network/abis'
import { parseUnits } from 'viem'

const requestedModule =
  'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1' as const

const args = {
  issuanceToken: TEST_ERC20_MOCK_ADDRESS,
  bondingCurveParams: {
    formula: TEST_BANCOR_FORMULA_ADDRESS,
    reserveRatioForBuying: 333_333,
    reserveRatioForSelling: 333_333,
    buyFee: '0',
    sellFee: '100',
    buyIsOpen: true,
    sellIsOpen: true,
    initialIssuanceSupply: '1',
    initialCollateralSupply: '3',
  },
  collateralToken: TEST_ERC20_MOCK_ADDRESS,
} as const

const expectedProccessed = [
  TEST_ERC20_MOCK_ADDRESS,
  {
    buyIsOpen: true,
    sellIsOpen: true,
    reserveRatioForBuying: 333_333,
    reserveRatioForSelling: 333_333,
    buyFee: 0n,
    sellFee: 100n,
    initialIssuanceSupply: parseUnits('1', 18),
    initialCollateralSupply: parseUnits('3', 18),
    formula: TEST_BANCOR_FORMULA_ADDRESS,
  },
  TEST_ERC20_MOCK_ADDRESS,
]

describe('#UNIT_DECIMALS_MATCH', () => {
  const { publicClient, walletClient } = sdk

  const configData = getModuleData(requestedModule).deploymentInputs.configData

  it('1: Match Expected ProccessedInputs With The Hard Coded', async () => {
    const orderedArgs = args
      ? configData.map((input) => args?.[input.name])
      : '0x00'

    const { processedInputs } = await processInputs({
      extendedInputs: configData,
      args: orderedArgs,
      publicClient,
      walletClient,
      kind: 'write',
    })

    expect(processedInputs).toStrictEqual(expectedProccessed)
  })
})
