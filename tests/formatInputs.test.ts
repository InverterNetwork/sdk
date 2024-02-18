import { expect, describe, it } from 'bun:test'

import writeToFile from '../tools/utils/writeLog'
import formatInputs from '../src/utlis/formatInputs'
import getAbiMethodMetas from '../src/utlis/getAbiMethodMetas'
import { data } from '@inverter-network/abis'

describe('Format Inputs of an abi', () => {
  it('Should Log Formatted Abi Inputs', async () => {
    const { methodMetas, abi } = data.BountyManager['v1.0']
    const { inputs } = getAbiMethodMetas(abi)[1]
    const formatted = formatInputs({
      methodMeta: methodMetas.addClaim,
      inputs,
    })
    writeToFile(formatted)
    expect(formatted).pass()
  })
})
