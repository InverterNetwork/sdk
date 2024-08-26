import { expect, describe, it } from 'bun:test'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import processInputs from '../../src/utils/processInputs'
import formatParameters from '../../src/utils/formatParameters'
import { getModuleData } from '@inverter-network/abis'
import { parseUnits } from 'viem'
import { iUSD } from '../testHelpers/getTestArgs'

const requestedModule =
  'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1' as const

const args = {
  issuanceToken: iUSD,
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
  collateralToken: iUSD,
} as const

const expectedProccessed = [
  iUSD,
  {
    buyIsOpen: true,
    sellIsOpen: true,
    reserveRatioForBuying: 333333n,
    reserveRatioForSelling: 333333n,
    buyFee: 0n,
    sellFee: 100n,
    initialIssuanceSupply: parseUnits('1', 18),
    initialCollateralSupply: parseUnits('3', 18),
    formula: '0x3ddE767F9DF9530DDeD47e1E012cCBf7B4A04dd7',
  },
  iUSD,
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
