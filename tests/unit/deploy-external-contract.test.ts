import type {
  DeployBytecodeReturnType,
  GetModuleReturnType,
  PopWalletClient,
} from '@/index'
import { beforeAll, describe, expect, it } from 'bun:test'
import {
  GET_HUMAN_READABLE_UINT_MAX_SUPPLY,
  sdk,
  TEST_ORCHESTRATOR_FACTORY_ADDRESS,
} from 'tests/helpers'

describe('#DEPLOY_EXTERNAL_CONTRACT', () => {
  let factory: GetModuleReturnType<'OrchestratorFactory_v1', PopWalletClient>
  let tokenDeployment: DeployBytecodeReturnType
  let token: GetModuleReturnType<'ERC20Issuance_v1', PopWalletClient>
  let trustedForwarderAddress: `0x${string}`

  beforeAll(async () => {
    factory = sdk.getModule({
      name: 'OrchestratorFactory_v1',
      address: TEST_ORCHESTRATOR_FACTORY_ADDRESS,
    })

    tokenDeployment = await sdk.deploy.bytecode({
      name: 'ERC20Issuance_v1',
      args: {
        symbol: 'TEST',
        name: 'TEST',
        decimals: 18,
        maxSupply: GET_HUMAN_READABLE_UINT_MAX_SUPPLY(18),
        initialAdmin: factory.address,
      },
    })

    token = sdk.getModule({
      name: 'ERC20Issuance_v1',
      address: tokenDeployment.contractAddress,
      tagConfig: {
        decimals: 18,
      },
    })

    trustedForwarderAddress = await factory.read.trustedForwarder.run()
  })

  it('Should deploy a new ERC20 issuance token, setMinter and transferOwnership', async () => {
    const bytecode = await tokenDeployment.run([
      await token.bytecode.setMinter.run([
        sdk.walletClient.account.address,
        true,
      ]),
      await token.bytecode.transferOwnership.run(
        sdk.walletClient.account.address
      ),
    ])

    const result = await sdk.moduleMulticall.write({
      trustedForwarderAddress,
      call: [
        {
          address: factory.address,
          allowFailure: false,
          callData: bytecode,
        },
      ],
    })

    expect(result.statuses[0]).toBe('success')
    expect(result.returnDatas[0]).toBeString()
    expect(result.transactionHash).toBeString()
  })
})
