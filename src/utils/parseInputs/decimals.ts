import { PublicClient, ReadContractParameters, parseUnits } from 'viem'
import { TOKEN_DATA_ABI } from '../constants'
import { Extras, FormattedAbiParameter } from '../../types'
import { Tag } from '@inverter-network/abis'

export default async function ({
  arg,
  args,
  inputs,
  extras,
  decimalsTag,
  publicClient,
  contract,
}: {
  arg: any
  args: any[]
  inputs: readonly FormattedAbiParameter[]
  extras?: Extras
  decimalsTag: Tag
  publicClient: PublicClient
  contract?: any
}) {
  let decimals = extras?.decimals

  const [, source, location, name] = decimalsTag?.split(':')
  const { readContract } = publicClient

  // INTERNAL CASE
  if (source === 'internal')
    switch (location) {
      case 'exact':
        decimals =
          // check if the value is contained by a non-tuple arg search it based on the index that is has in `inputs`
          args[inputs.findIndex((input) => input.name === name)] ||
          // or if there is a tuple arg that contains a parameter with `name`which would provide the decimals
          args.find((item) => typeof item === 'object' && name in item)[name]

        break
      case 'indirect':
        const address = args[inputs.findIndex((input) => input.name === name)]
        decimals = <number>await readContract({
          address,
          abi: TOKEN_DATA_ABI,
          functionName: 'decimals',
        })
        break
    }
  // EXTERNAL CASE
  else if (source === 'external')
    switch (location) {
      case 'indirect':
        const tokenAddress = <`0x${string}`>await readContract({
          address: contract.address,
          abi: contract.abi,
          functionName: name,
        } as ReadContractParameters)
        decimals = <number>await readContract({
          address: tokenAddress,
          abi: TOKEN_DATA_ABI,
          functionName: 'decimals',
        })
        break
      case 'exact':
        decimals = <number>await readContract({
          address: contract.address,
          abi: TOKEN_DATA_ABI,
          functionName: name,
        })
        break
    }

  if (!decimals) throw new Error('No decimals provided')
  return parseUnits(arg, decimals)
}
