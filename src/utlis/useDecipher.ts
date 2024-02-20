import { MethodMeta } from '@inverter-network/abis'
import { Entries } from 'type-fest'
import { DecipherableOutput } from '../types/output'
import { DecipherableInput } from '../types/input'

type DecipherProps = DecipherableOutput | DecipherableInput

export default function useDecipher<M extends MethodMeta>(methodMeta: M) {
  const { descriptions, tags } = methodMeta
  // Get the entries from the descriptions and tags
  const descriptionsEntries = entriesFromObject(descriptions),
    tagEntries = entriesFromObject(tags)

  const findTagEntry = (name: string) =>
      tagEntries.find(([k]) => k === name) || [],
    findDescEntry = (name: string) =>
      descriptionsEntries.find(([k]) => k === name) || []

  const decipher = <T extends DecipherProps>(inout: T) => {
    const { name, type } = inout,
      // Find the tag and description for the input
      [tagKey, tagVal] = findTagEntry(name),
      [descKey, descVal] = findDescEntry(name)

    // Set the description and tag to empty values
    const tag = tagKey === name ? tagVal : undefined
    const description = (() => {
      if (descKey === name) return descVal as Extract<typeof descVal, string>
      else if (descKey === 'returns')
        return descVal as Extract<typeof descVal, object>

      return undefined
    })()

    return {
      name,
      type,
      tag,
      description,
    }
  }

  return decipher
}

export type Decipher = ReturnType<typeof useDecipher>

function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>
}
