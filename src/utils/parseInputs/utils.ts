import { PublicClient, parseUnits, stringToHex } from 'viem'
import {
  TupleFormattedAbiParameter,
  Extras,
  FormattedAbiParameter,
} from '../../types'
import parse, { DecimalsCallback } from './parse'
import { Tag } from '@inverter-network/abis'
import { DECIMALS_ABI } from '../../getDeploy/constants'

type TupleCaseParams = {
  input: TupleFormattedAbiParameter
  arg: any
  extras?: Extras
  decimalsCallback: DecimalsCallback
}

// TODO: Add error handling, for empty data
export const any = (arg: any) => stringToHex(JSON.stringify(arg))

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

// Parse a string or number to a big int
export const stringNumber = (arg: any) => {
  if (Number(arg) * 0 === 0) return BigInt(arg)
  return arg
}

// The error case for decimals tag
export const decimals = async ({
  arg,
  args,
  inputs,
  extras,
  decimalsTag,
  publicClient,
}: {
  arg: any
  args: any[]
  inputs: FormattedAbiParameter[]
  extras?: Extras
  decimalsTag: Tag
  publicClient: PublicClient
}) => {
  let decimals = extras?.decimals

  const [, source, location, name] = decimalsTag?.split(':')
  if (source === 'internal') {
    switch (location) {
      case 'exact':
        decimals = args[inputs.findIndex((input) => input.name === name)]
        break
      case 'indirect':
        const address = args[inputs.findIndex((input) => input.name === name)]
        const { readContract } = publicClient
        decimals = <number>await readContract({
          address,
          abi: DECIMALS_ABI,
          functionName: 'decimals',
        })
        break
    }
  }

  if (!decimals) throw new Error('No decimals provided')
  return parseUnits(arg, decimals)
}
