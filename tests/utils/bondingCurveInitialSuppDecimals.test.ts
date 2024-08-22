import { describe, it } from 'bun:test'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src'

describe('#bondingCurveInitialSuppDecimals.test', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const sdk = new Inverter({ publicClient, walletClient })

  it('log virtual: collateral and issuance supply', async () => {
    const workflow = await sdk.getWorkflow({
      orchestratorAddress: '0xa2bc1f4764419118700A1a62213bC559bDDd067D',
      requestedModules: {
        authorizer: 'AUT_Roles_v1',
        paymentProcessor: 'PP_Simple_v1',
        fundingManager: 'FM_BC_Bancor_Redeeming_VirtualSupply_v1',
      },
    })

    const virtualIssuanceSupply =
      await workflow.fundingManager.read.getVirtualIssuanceSupply.run()

    const virtualCollateralSupply =
      await workflow.fundingManager.read.getVirtualCollateralSupply.run()

    console.log('virtualIssuanceSupply:', virtualIssuanceSupply)

    console.log('virtualCollateralSupply:', virtualCollateralSupply)
  })
})
