import { expect, describe, it } from 'bun:test'

import { getTestConnectors } from '../testHelpers/getTestConnectors'
import formatOutputs from '../../src/getModule/formatOutputs'

import { type FormattedAbiParameter } from '../../src'

describe('#formatOutputs', () => {
  const { publicClient } = getTestConnectors()
  const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // USDC has 6 decimals
  const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a'
  const mockAbi = [
    {
      constant: true,
      inputs: [],
      name: 'tokenAddress',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ]
  const mockContract = { address: mockAddress, abi: mockAbi }

  describe('#formatOutputs', () => {
    describe('with decimals tag', () => {
      describe('with the default token (tag = `decimals`)', () => {
        const formattedOutputs = [
          {
            internalType: 'uint256',
            name: 'mockInputName',
            type: 'uint256',
            tags: ['decimals'],
            description: 'Blablablala',
          },
        ] satisfies FormattedAbiParameter[]

        const extras = {
          walletAddress:
            '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
          decimals: 10,
          defaultToken: USDC_SEPOLIA as `0x${string}`,
        }

        const res = [420690000000000n]

        it('applies the decimals from the `extras` param', async () => {
          const result = (await formatOutputs({
            formattedOutputs,
            res,
            extras,
            publicClient,
            contract: mockContract,
          })) as any

          expect(result).toEqual('42069')
        })
      })
    })
  })
})
