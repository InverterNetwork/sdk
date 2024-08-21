import { expect, describe, it } from 'bun:test'

import getWorkflow from '../../src/getWorkflow'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import writeLog from '../../tools/writeLog'

describe('#getWorkflow', async () => {
  const { publicClient, walletClient } = getTestConnectors()

  describe('Modules: AUT_Roles_v1, FM_BC_Restricted, PP_Streaming_v1, LM_PC_PaymentRouter_v1', async () => {
    const workflow = await getWorkflow({
      publicClient,
      walletClient,
      orchestratorAddress: '0xBc986B80A3c6b274CEd09db5A3b0Ac76a4046968',
      requestedModules: {
        authorizer: 'AUT_Roles_v1',
        fundingManager: 'FM_BC_Restricted_Bancor_Redeeming_VirtualSupply_v1',
        paymentProcessor: 'PP_Streaming_v1',
        optionalModules: ['LM_PC_PaymentRouter_v1'],
      },
    })

    it('Log the Workflow', () => {
      writeLog({
        content: { workflow },
        label: 'aut_fm-bc_pp_pr',
      })

      expect(workflow).toBeDefined()
    })

    it('Read Funding Manager Total Supply', async () => {
      const url = await workflow.fundingManager.read.url.run()
      writeLog({
        content: { url },
        label: 'url',
      })

      expect(url).toBeDefined()
    })

    it('Should have fundingToken / issuanceToken, address, module, decimals, symbol', () => {
      expect(workflow.fundingToken).toBeDefined()
      expect(workflow.fundingToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])

      expect(workflow.issuanceToken).toBeDefined()
      expect(workflow.issuanceToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])
    })
  })

  describe('Modules: AUT_Roles_v1, FM_DepositVault_v1, PP_Streaming_v1, LM_PC_Bounties_v1', async () => {
    const workflow = await getWorkflow({
      publicClient,
      walletClient,
      orchestratorAddress: '0x59c5A9Dea8200C2CE8Ca46832530e667E4c5eD22',
      requestedModules: {
        authorizer: 'AUT_Roles_v1',
        fundingManager: 'FM_DepositVault_v1',
        paymentProcessor: 'PP_Streaming_v1',
        optionalModules: ['LM_PC_Bounties_v1'],
      },
    })

    it('Log the Workflow', () => {
      writeLog({
        content: { workflow },
        label: 'aut_fm-dv_pp_pr',
      })

      expect(workflow).toBeDefined()
    })

    it('Should have fundingToken, address, module, decimals, symbol', () => {
      expect(workflow.fundingToken).toBeDefined()
      expect(workflow.fundingToken).toContainKeys([
        'address',
        'module',
        'decimals',
        'symbol',
      ])
    })
  })
})
