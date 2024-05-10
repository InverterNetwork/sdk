import { expect, describe, it, beforeEach } from 'bun:test'

import parseInputs from '../../src/utils/parseInputs'
import { getTestConnectors } from '../getTestConnectors'

describe('#parseInputs', () => {
  const { publicClient, walletClient } = getTestConnectors()

  const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // USDC has 6 decimals

  describe('with decimals tag', () => {
    describe.only('with :external', () => {
      const args = ['42069']
      const formattedInputs = [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'minimumPayoutAmount',
          type: 'uint256',
          tags: ['decimals:external:exact:fundingManager'],
          description:
            'The minimum amount of tokens the Bounty will pay out upon being claimed',
        },
      ]
      const extras = {
        walletAddress:
          '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
      }

      let minimumPayoutAmount

      beforeEach(async () => {
        ;[minimumPayoutAmount] = await parseInputs({
          formattedInputs,
          args,
          extras,
          publicClient,
        })
      })

      describe('with :exact (collateral token)', () => {
        it('applies the collateral token decimals to user inputs', async () => {
          expect(minimumPayoutAmount).toEqual(42069)
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

      let initialTokenSupply, initialCollateralSupply

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
        it('retrieves and applies the decimals contract specified by user input', () => {
          expect(initialCollateralSupply).toEqual(69000000n)
        })
      })
    })
  })
})
