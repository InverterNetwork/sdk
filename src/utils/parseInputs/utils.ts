import {
  PublicClient,
  ReadContractParameters,
  parseUnits,
  stringToHex,
} from 'viem'
import {
  TupleFormattedAbiParameter,
  Extras,
  FormattedAbiParameter,
} from '../../types'
import parse, { DecimalsCallback } from './parse'
import { Tag } from '@inverter-network/abis'
import { TOKEN_DATA_ABI } from '../constants'

type TupleCaseParams = {
  input: TupleFormattedAbiParameter
  arg: any
  extras?: Extras
  decimalsCallback: DecimalsCallback
}

// TODO: Add error handling, for empty data
export const any = (arg: any) => {
  try {
    stringToHex(JSON.stringify(arg))
  } catch {
    return '0x0'
  }
}

// The case for tuple arguments
export const tuple = async ({
  input,
  arg,
  extras,
  decimalsCallback,
}: TupleCaseParams) => {
  const formattedTuple: any = {}
  // iterate over the components of the tuple template
  await Promise.all(
    input.components.map(async (c, index) => {
      // try the name of the component, if it doesn't exist, use the index
      formattedTuple[c.name ?? `_${index}`] = await parse({
        input: c,
        arg: arg[c.name ?? index],
        extras,
        decimalsCallback,
      })
    })
  )

  return formattedTuple
}

// The case for tuple[] arguments
export const tupleArray = ({ arg, ...rest }: TupleCaseParams) =>
  arg.map((argI: any) => tuple({ arg: argI, ...rest }))

// The error case for decimals tag
export const decimals = async ({
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
  inputs: FormattedAbiParameter[]
  extras?: Extras
  decimalsTag: Tag
  publicClient: PublicClient
  contract?: any
}) => {
  let decimals = extras?.decimals

  const [, source, location, name] = decimalsTag?.split(':')
  const { readContract } = publicClient

  if (source === 'internal') {
    switch (location) {
      case 'exact':
        decimals = args[inputs.findIndex((input) => input.name === name)]
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
  } else if (source === 'external') {
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
    }
  }
  if (!decimals) throw new Error('No decimals provided')
  return parseUnits(arg, decimals)
}
