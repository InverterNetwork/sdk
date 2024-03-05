import { expect, describe, it } from 'bun:test'

import { hexToString, stringToHex } from 'viem'

describe('Generic Format', () => {
  let hexedArr: `0x${string}`

  it('Should stringify and hex an array', () => {
    const arr = ['this is an inverter project']
    hexedArr = stringToHex(JSON.stringify(arr))
    console.log('hexedArr', hexedArr)
    expect(hexedArr).pass()
  })

  it('Should parse and string from hex an array', async () => {
    const parsedArr = JSON.parse(hexToString(hexedArr))
    console.log('parsedArr', parsedArr)
    expect(parsedArr).pass()
  })
})
