import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { Inverter } from '../../src'

describe('#getModule_simulate', async () => {
  const { publicClient, walletClient } = getTestConnectors()

  const sdk = new Inverter({ publicClient, walletClient })

  const workflow = await sdk.getWorkflow({
    orchestratorAddress: '0xAb70B77d3F9c16074fD536Aa21A3d0F568300bEd',
  })

  it(
    'simulate',
    async () => {
      const hash = await workflow.fundingToken.module.write.approve.run([
        workflow.fundingManager.address,
        '10000',
      ])

      await publicClient.waitForTransactionReceipt({ hash })

      const res = await workflow.fundingManager.simulate.deposit.run('10000')

      expect(res).toBeTruthy()
    },
    { timeout: 50_000 }
  )
})
