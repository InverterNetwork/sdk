import { MethodMeta, ReturnDescription } from '@inverter-network/abis'
import { Entries, ValueOf, UnionToIntersection } from 'type-fest'
import { DecipherableOutput } from '../types/output'
import { DecipherableInput } from '../types/input'

export default function useDecipher<M extends MethodMeta>(methodMeta: M) {
  const { descriptions, tags } = methodMeta
  // Get the entries from the descriptions and tags
  const descriptionsEntries = entriesFromObject(descriptions),
    tagEntries = entriesFromObject(tags)

  const findTagEntry = (name: string) =>
      tagEntries.find(([k]) => k === name) || [],
    findDescEntry = (name: string) =>
      descriptionsEntries.find(([k]) => k === name) || []

  const input = <I extends DecipherableInput>(input: I) => {
    const { name, type } = input,
      // Find the tag and description for the input
      [tagKey, tagVal] = findTagEntry(name),
      [descKey, descVal] = findDescEntry(name)

    // Set the description and tag to empty values
    const tag = tagKey === name ? tagVal : undefined
    const description = (() => {
      if (descKey === name) return descVal as Extract<typeof descVal, string>

      return undefined
    })()

    return {
      name,
      type,
      tag,
      description,
    }
  }

  const output = <O extends DecipherableOutput>(output: O) => {
    const { name, type } = output,
      // Find the tag and description for the input
      [tagKey, tagVal] = findTagEntry(name),
      returns = findDescEntry(
        'returns'
      )[1] as UnionToIntersection<ReturnDescription>,
      returnsKeyName = name as keyof UnionToIntersection<ReturnDescription>

    // Set the description and tag to empty values
    const tag = tagKey === name ? tagVal : undefined
    const description = (() => {
      if (
        !!returns &&
        !!returnsKeyName &&
        Object.hasOwn(returns, returnsKeyName)
      )
        return returns[returnsKeyName]

      return undefined
    })()

    return {
      name,
      type,
      tag,
      description,
    }
  }

  return {
    input,
    output,
  }
}

export type Decipher = ReturnType<typeof useDecipher>

// export type Deciphered<T extends 'input' | 'output'> = T extends 'input'
//   ? Extract<ReturnType<Decipher>, { variant: 'input' }>
//   : Exclude<ReturnType<Decipher>, { variant: 'output' }>

function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>
}
