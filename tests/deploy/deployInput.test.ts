import { expect, describe, it } from 'bun:test'
import writeLog from '../../tools/writeLog'
import { getDeploy } from '../../src'
import { getTestConnectors } from '../getTestConnectors'
import { Hex } from 'viem'

describe('main', async () => {
  const { walletClient } = getTestConnectors()
  it('Should log the Deploy Function possible inputs', async () => {
    const { run, inputs } = await getDeploy(walletClient, {
      authorizer: {
        name: 'RoleAuthorizer',
        version: '1',
      },
      fundingManager: {
        name: 'RebasingFundingManager',
        version: '1',
      },
      paymentProcessor: {
        name: 'SimplePaymentProcessor',
        version: '1',
      },
    })

    const t = run({
      authorizer: {
        initialManager: '0x' as Hex,
        initialOwner: '0x' as Hex,
      },
      fundingManager: {
        orchestratorTokenAddress: '0x' as Hex,
      },
      orchestrator: {
        owner: '0x' as Hex,
        token: '0x' as Hex,
      },
    })

    console.log(t)

    writeLog({
      content: inputs,
      label: 'DeployFunctionInputs',
    })

    expect(inputs).toBeObject()
  })
})
