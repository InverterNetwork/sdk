import { expect, describe, it } from 'bun:test'

import parseInputs from '../../src/utils/parseInputs'
import { getTestConnectors } from '../testHelpers/getTestConnectors'
import { TOKEN_DATA_ABI } from '../../src/utils/constants'
import { FormattedAbiParameter } from '../../src'
import { InverterSDK } from '../../src/InverterSDK'
import { Tag } from '@inverter-network/abis'

describe('#parseInputs', () => {
  const { publicClient, walletClient } = getTestConnectors()
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

  describe('#inputsWithDecimals', () => {
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
          const { inputsWithDecimals } = await parseInputs({
            formattedInputs,
            args,
            extras,
            publicClient,
            walletClient,
            contract: mockContract,
          })
          expect(inputsWithDecimals[0]).toEqual(420690000000000n)
        })

        describe('with approval tag', () => {
          const tags = ['decimals', 'approval']
          const formattedInputsWithApproval = [{ ...formattedInputs[0], tags }]

          it('returns the required approvals', async () => {
            const { requiredAllowances } = await parseInputs({
              formattedInputs:
                formattedInputsWithApproval as FormattedAbiParameter[],
              args,
              extras,
              publicClient,
              walletClient,
              contract: mockContract,
            })

            expect(requiredAllowances).toHaveLength(1)
            expect(requiredAllowances[0]).toEqual({
              amount: 420690000000000n,
              spender: '0x80f8493761a18d29fd77c131865f9cf62b15e62a',
              owner: walletClient.account.address,
              token: USDC_SEPOLIA,
            })
          })
        })
      })

      describe('with :external', () => {
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
          const tags = [
            'decimals:external:indirect:tokenAddress',
          ] satisfies Tag[] // should resolve to usdc on sepolia w/ decimals
          const formattedInputs = [
            { ...sharedFormattedInput, tags },
          ] as FormattedAbiParameter[]

          it('retrieves token from module and the decimals from token', async () => {
            const { inputsWithDecimals } = await parseInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              walletClient,
              contract: mockContract,
            })
            expect(inputsWithDecimals[0]).toEqual(42069000000n)
          })
        })

        describe('with :exact', () => {
          const mockModuleWithErc20 = USDC_SEPOLIA
          const mockContract = {
            address: mockModuleWithErc20,
            abi: TOKEN_DATA_ABI,
          }
          const tags = ['decimals:external:exact:decimals'] as Tag[]
          const formattedInputs = [
            { ...sharedFormattedInput, tags },
          ] as FormattedAbiParameter[]

          it('retrieves the decimals from module which is token', async () => {
            const { inputsWithDecimals } = await parseInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              contract: mockContract,
            })
            expect(inputsWithDecimals[0]).toEqual(42069000000n)
          })

          describe('with sdk instance', () => {
            const sdk = new InverterSDK(publicClient, walletClient)

            // this test case is a bit confusing:
            // it passes in the USDC contract
            it('stores token info in cache', async () => {
              const formattedInputs = [
                { ...sharedFormattedInput, tags },
              ] as FormattedAbiParameter[]
              await parseInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
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
              await parseInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
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
            tags: ['decimals:internal:exact:decimals'],
          },
          {
            name: 'initialCollateralSupply',
            type: 'uint256',
            description: 'The initial virtual collateral token supply',
            tags: ['decimals:internal:indirect:acceptedToken'],
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
            const { inputsWithDecimals } = await parseInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              walletClient,
              contract: { address: mockAddress },
            })
            const [, initialTokenSupply, , ,] = inputsWithDecimals
            expect(initialTokenSupply).toEqual(420000000000000000000n)
          })
        })

        describe('with :indirect', () => {
          it('retrieves decimals from token specified by user input', async () => {
            const { inputsWithDecimals } = await parseInputs({
              formattedInputs,
              args,
              extras,
              publicClient,
              walletClient,
              contract: mockContract,
            })
            const [, , initialCollateralSupply, ,] = inputsWithDecimals
            expect(initialCollateralSupply).toEqual(69000000n)
          })

          describe('with sdk instance', () => {
            const sdk = new InverterSDK(publicClient, walletClient)

            it('stores token info in cache', async () => {
              await parseInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
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
              await parseInputs({
                formattedInputs,
                args,
                extras,
                publicClient,
                walletClient,
                contract: mockContract,
                self: sdk,
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
