import { expect, describe, it, beforeEach } from 'bun:test'

import parseInputs from '../../src/utils/parseInputs'
import { getTestConnectors } from '../getTestConnectors'
import { DECIMALS_ABI } from '../../src/getDeploy/constants'

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
      const sharedFormattedInput = {
        indexed: false,
        internalType: 'uint256',
        name: 'mockInputName',
        type: 'uint256',
        description: 'Blablablala',
      }
      const args = ['42069']
      const extras = {
        walletAddress:
          '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
      }

      describe('with :indirect', () => {
        const mockAddress = '0x80f8493761a18d29fd77c131865f9cf62b15e62a' // self-deployed mock contract
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
        const tags = ['decimals:external:indirect:tokenAddress'] // should resolve to usdc on sepolia w/ decimals
        const formattedInputs = [{ ...sharedFormattedInput, tags }]

        it('retrieves token from module and the decimals from token', async () => {
          const [minimumPayoutAmount] = await parseInputs({
            formattedInputs,
            args,
            extras,
            publicClient,
            contract: mockContract,
          })
          expect(minimumPayoutAmount).toEqual(42069000000n)
        })
      })

      describe('with :exact', () => {
        const mockContract = { address: USDC_SEPOLIA, abi: DECIMALS_ABI }
        const tags = ['decimals:external:exact:decimals']
        const formattedInputs = [{ ...sharedFormattedInput, tags }]

        it('retrieves the decimals from module which is token', async () => {
          const [minimumPayoutAmount] = await parseInputs({
            formattedInputs,
            args,
            extras,
            publicClient,
            contract: mockContract,
          })
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
