import { expect, describe, it, beforeEach } from 'bun:test'

import parseInputs from '../../src/utils/parseInputs'
import { getTestConnectors } from '../getTestConnectors'

describe('#parseInputs', () => {
  const { publicClient /* , walletClient */ } = getTestConnectors()
  const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // USDC has 6 decimals

  describe('with decimals tag', () => {
    describe('without additional tags', () => {
      const formattedInputs = [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'mockInputName',
          type: 'uint256',
          tags: ['decimals'],
          description: 'Blablablala',
        },
      ]
      const extras = {
        walletAddress:
          '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
        decimals: 10,
      }
      const args = ['42069']

      it('applies the decimals from the `extras` param', async () => {
        const [value] = await parseInputs({
          formattedInputs,
          args,
          extras,
          publicClient,
          contract: {},
        })
        expect(value).toEqual(420690000000000n)
      })
    })

    describe('with :external', () => {
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
      const args = ['42069']
      const formattedInputs = [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'mockInputName',
          type: 'uint256',
          tags: ['decimals:external:indirect:tokenAddress'], // should resolve to usdc on sepolia w/ decimals
          description: 'Blablablala',
        },
      ]
      const extras = {
        walletAddress:
          '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
        decimals: 10,
      }

      let minimumPayoutAmount: bigint

      beforeEach(async () => {
        ;[minimumPayoutAmount] = await parseInputs({
          formattedInputs,
          args,
          extras,
          publicClient,
          contract: mockContract,
        })
      })

      describe('with :indirect', () => {
        it('retrieves token from module and the decimals from token', async () => {
          expect(minimumPayoutAmount).toEqual(42069000000n)
        })
      })
    })

    describe('with :internal', () => {
      const args = ['18', '420', '69', USDC_SEPOLIA]
      const formattedInputs = [
        {
          name: 'decimals',
          type: 'uint8',
          description: 'The decimals used within the issuance token',
          jsType: 'string',
        },
        {
          name: 'initialTokenSupply',
          type: 'uint256',
          description: 'The initial virtual issuance token supply',
          tags: ['decimals:internal:exact:decimals'],
          jsType: 'string',
        },
        {
          name: 'initialCollateralSupply',
          type: 'uint256',
          description: 'The initial virtual collateral token supply',
          tags: ['decimals:internal:indirect:acceptedToken'],
          jsType: 'string',
        },
        {
          name: 'acceptedToken',
          type: 'address',
          description:
            'The address of the token that will be deposited to the funding manager',
        },
      ]
      const extras = {
        walletAddress:
          '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
      }

      let initialTokenSupply: BigInt, initialCollateralSupply: BigInt

      beforeEach(async () => {
        ;[, initialTokenSupply, initialCollateralSupply, ,] = await parseInputs(
          { formattedInputs, args, extras, publicClient }
        )
      })

      describe('with :exact', () => {
        it('applies the decimals from the user inputs', async () => {
          expect(initialTokenSupply).toEqual(420000000000000000000n)
        })
      })

      describe('with :indirect', () => {
        it('retrieves decimals from token specified by user input', () => {
          expect(initialCollateralSupply).toEqual(69000000n)
        })
      })
    })
  })
})
