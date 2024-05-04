import { expect, describe, it } from 'bun:test'
import { getModuleSchema } from '../../src/getDeploy/getDeploySchema'
import writeLog from '../../tools/writeLog'

describe('main', async () => {
  it('Should log the Deploy Function possible inputs', async () => {
    const res = getModuleSchema({
      name: 'BancorVirtualSupplyBondingCurveFundingManager',
      version: '1',
    })

    writeLog({
      content: res,
      label: 'DeployFunctionInputs',
    })

    expect(res).toBeObject()
  })
})
