import { expect, describe, it } from 'bun:test'

import processInputs from '../../src/utils/processInputs'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { ERC20_ABI, FM_BASE } from '../../src/utils/constants'
import { Inverter } from '../../src/Inverter'
import { iUSD } from '../testHelpers/getTestArgs'

import { type FormattedAbiParameter } from '../../src'
import type { Tag } from '@inverter-network/abis'

describe('#processInputs', () => {
  const { publicClient, walletClient } = getTestConnectors()
  const USDC_SEPOLIA = '0x5fd84259d66Cd46123540766Be93DFE6D43130D7' // USDC has 6 decimals
  const mockAddress = '0xa2c6191878a2ad73047F6a37442141FF2B3cAbBA'
  const mockContract = { address: mockAddress, abi: FM_BASE }

  describe('#processedInputs', () => {
    describe('with decimals tag', () => {
      describe('with the default token (tag = `decimals`)', () => {
        const formattedInputs = [
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
        const args = ['42069']

        it('applies the decimals from the `extras` param', async () => {
          const { processedInputs } = await processInputs({
            formattedInputs,
            args,
            extras,
            publicClient,
            walletClient,
            contract: mockContract,
            kind: 'read',
          })
          expect(processedInputs[0]).toEqual(420690000000000n)
        })

        describe('with approval tag', () => {
          const tags = ['decimals', 'approval']
          const formattedInputsWithApproval = [{ ...formattedInputs[0], tags }]

          it(
            'returns the required approvals',
            async () => {
              const { requiredAllowances } = await processInputs({
                formattedInputs:
                  formattedInputsWithApproval as FormattedAbiParameter[],
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                kind: 'write',
              })

              expect(requiredAllowances).toHaveLength(1)
              expect(requiredAllowances[0]).toEqual({
                amount: 420690000000000n,
                spender: '0xa2c6191878a2ad73047F6a37442141FF2B3cAbBA',
                owner: walletClient.account.address,
                token: USDC_SEPOLIA,
              })
            },
            {
              timeout: 10000,
            }
          )
        })
      })

      describe('with :contract', () => {
        const sharedFormattedInput = {
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
          const mockContract = { read: { issuanceToken: () => iUSD } }
          const tags = [
            'decimals:contract:indirect:issuanceToken',
          ] satisfies Tag[] // should resolve to usdc on sepolia w/ decimals
          const formattedInputs = [
            { ...sharedFormattedInput, tags },
          ] as FormattedAbiParameter[]

          it('retrieves token from module and the decimals from token', async () => {
            const { processedInputs } = await processInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              walletClient,
              contract: mockContract,
              kind: 'read',
            })
            expect(processedInputs[0]).toEqual(42069000000000000000000n)
          })
        })

        describe('with :exact', () => {
          const mockModuleWithErc20 = USDC_SEPOLIA
          const mockContract = {
            address: mockModuleWithErc20,
            abi: ERC20_ABI,
          }
          const tags = ['decimals:contract:exact:decimals'] as Tag[]
          const formattedInputs = [
            { ...sharedFormattedInput, tags },
          ] as FormattedAbiParameter[]

          it('retrieves the decimals from module which is token', async () => {
            const { processedInputs } = await processInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              contract: mockContract,
              kind: 'read',
            })
            expect(processedInputs[0]).toEqual(42069000000n)
          })

          describe('with sdk instance', () => {
            const sdk = new Inverter({ publicClient, walletClient })

            // this test case is a bit confusing:
            // it passes in the USDC contract
            it('stores token info in cache', async () => {
              const formattedInputs = [
                { ...sharedFormattedInput, tags },
              ] as FormattedAbiParameter[]
              await processInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
                kind: 'read',
              })
              expect(
                sdk.tokenCache.get(
                  // @ts-ignore object is defined
                  `${mockModuleWithErc20}:${formattedInputs[0].tags[0]}`
                )
              ).toEqual({
                address: mockModuleWithErc20,
                decimals: 6,
              })
            })

            it('reads token info from cache if available', async () => {
              await sdk.tokenCache.set(
                // @ts-ignore object is defined
                `${mockAddress}:${formattedInputs[0].tags[0]}`,
                {
                  address: mockModuleWithErc20,
                  decimals: 6,
                }
              )
              const start = performance.now()
              await processInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
                kind: 'read',
              })
              const ms = performance.now() - start
              expect(ms).toBeLessThan(1)
            })
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
          },
          {
            name: 'initialTokenSupply',
            type: 'uint256',
            description: 'The initial virtual issuance token supply',
            tags: ['decimals:params:exact:decimals'],
          },
          {
            name: 'initialCollateralSupply',
            type: 'uint256',
            description: 'The initial virtual collateral token supply',
            tags: ['decimals:params:indirect:acceptedToken'],
          },
          {
            name: 'acceptedToken',
            type: 'address',
            description:
              'The address of the token that will be deposited to the funding manager',
          },
        ] satisfies FormattedAbiParameter[]
        const extras = {
          walletAddress:
            '0x86fda565A5E96f4232f8136141C92Fd79F2BE950' as `0x${string}`,
          defaultToken: USDC_SEPOLIA as `0x${string}`,
          decimals: 6,
        }

        describe('with :exact', () => {
          it('applies the decimals from the user inputs', async () => {
            const { processedInputs } = await processInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              walletClient,
              contract: { address: mockAddress },
              kind: 'read',
            })
            const [, initialTokenSupply, , ,] = processedInputs
            expect(initialTokenSupply).toEqual(420000000000000000000n)
          })
        })

        describe('with :indirect', () => {
          it('retrieves decimals from token specified by user input', async () => {
            const { processedInputs } = await processInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              walletClient,
              contract: mockContract,
              kind: 'read',
            })
            const [, , initialCollateralSupply, ,] = processedInputs
            expect(initialCollateralSupply).toEqual(69000000n)
          })

          describe('with sdk instance', () => {
            const sdk = new Inverter({ publicClient, walletClient })

            it('stores token info in cache', async () => {
              await processInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
                kind: 'read',
              })
              expect(
                sdk.tokenCache.get(
                  // @ts-ignore object possibly undefined
                  `${mockAddress}:${formattedInputs[2].tags[0]}`
                )
              ).toEqual({
                address: USDC_SEPOLIA,
                decimals: 6,
              })
            })

            it('reads token info from cache if available', async () => {
              sdk.tokenCache.set(
                // @ts-ignore object possibly undefined
                `${mockAddress}:${formattedInputs[2].tags[0]}`,
                {
                  address: USDC_SEPOLIA,
                  decimals: 6,
                }
              )
              const start = performance.now()
              await processInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
                kind: 'read',
              })
              const ms = performance.now() - start
              expect(ms).toBeLessThan(1)
            })
          })
        })
      })
    })
  })

  describe('#requiredAllowances', () => {})
})
