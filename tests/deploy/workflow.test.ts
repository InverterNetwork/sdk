import { expect, describe, it } from 'bun:test'
import { getDeploy } from '../../src'
import { getTestConnectors } from '../getTestConnectors'
import writeLog from '../../tools/writeLog'

describe('#DEPLOY_WORKFLOW', async () => {
  const { publicClient, walletClient } = getTestConnectors()
  it('Log: TX_HASH, INPUTS, ORCH_ADRESS', async () => {
    const { run /* , inputs */ } = await getDeploy(publicClient, walletClient, {
      authorizer: 'AUT_Roles_v1',
      fundingManager: 'FM_Rebasing_v1',
      paymentProcessor: 'PP_Simple_v1',
      optionalModules: ['LM_PC_Bounties_v1'],
    })

    const { orchestratorAddress, transactionHash } = await run({
      authorizer: {
        initialManager: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
        initialOwner: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
      },
      fundingManager: {
        orchestratorTokenAddress: '0xdbEdA5eD0d488f892C747217aF9f86091F5Ec4A7',
      },
      orchestrator: {
        owner: '0x5AeeA3DF830529a61695A63ba020F01191E0aECb',
        token: '0xdbEdA5eD0d488f892C747217aF9f86091F5Ec4A7',
      },
    })

    writeLog({
      content: { orchestratorAddress, transactionHash },
      label: 'deployed_workflow',
    })

    expect(orchestratorAddress).toStartWith('0x')
    expect(transactionHash).toStartWith('0x')
  })
})
