import { expect, describe, it } from 'bun:test'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import processInputs from '../../src/utils/processInputs'
import formatParameters from '../../src/utils/formatParameters'
import { getModuleData } from '@inverter-network/abis'

const requestedModule =
  'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1' as const

const args = {
  issuanceToken: '0x381BaFEA95ef0475cA544D38d6a404CEFcE93b9a',
  bondingCurveParams: {
    formula: '0x3ddE767F9DF9530DDeD47e1E012cCBf7B4A04dd7',
    reserveRatioForBuying: '333333',
    reserveRatioForSelling: '333333',
    buyFee: '0',
    sellFee: '100',
    buyIsOpen: true,
    sellIsOpen: true,
    initialIssuanceSupply: '1',
    initialCollateralSupply: '3',
  },
  collateralToken: '0x71bd16Dd7A120a12a27439F5D3767Be795d4A991',
} as const

const expectedProccessed = [
  '0x381BaFEA95ef0475cA544D38d6a404CEFcE93b9a',
  {
    buyIsOpen: true,
    sellIsOpen: true,
    reserveRatioForBuying: 333333n,
    reserveRatioForSelling: 333333n,
    buyFee: 0n,
    sellFee: 100n,
    initialIssuanceSupply: 1n,
    initialCollateralSupply: 3n,
    formula: '0x3ddE767F9DF9530DDeD47e1E012cCBf7B4A04dd7',
  },
  '0x71bd16Dd7A120a12a27439F5D3767Be795d4A991',
]

describe('#bondingDeployDecimal', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const configData = getModuleData(requestedModule).deploymentInputs.configData

  it('match: expected proccessedInputs with hard coded', async () => {
    const formattedInputs = formatParameters({ parameters: configData })

    const orderedArgs = args
      ? formattedInputs.map((input) => args?.[input.name])
      : '0x00'

    const { processedInputs } = await processInputs({
      formattedInputs,
      args: orderedArgs,
      publicClient,
      walletClient,
      kind: 'write',
    })

    expect(processedInputs).toStrictEqual(expectedProccessed)
  })
})
