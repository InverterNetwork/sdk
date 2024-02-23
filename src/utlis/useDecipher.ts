import {
  MethodKey,
  MethodMeta,
  ModuleKeys,
  ModuleVersionKeys,
} from '@inverter-network/abis'
import { Entries, PickDeep } from 'type-fest'
import { DecipherableOutput } from '../types/output'
import { DecipherableInput } from '../types/input'
import { isValidMethodMeta } from '../types/guards'

export default function useDecipher<
  K extends ModuleKeys,
  V extends ModuleVersionKeys,
  MK extends MethodKey<K, V>,
>(methodMeta: MethodMeta<K, V>[MK]) {
  if (!isValidMethodMeta(methodMeta))
    throw new Error('Invalid methodMeta object')

  type OutputDescriptions = PickDeep<typeof descriptions, 'returns'>
  const { descriptions, tags } = methodMeta,
    // Get the entries from the descriptions and tags
    tagEntries = entriesFromObject(tags),
    findTagEntry = (name: string) => tagEntries.find(([k]) => k === name) || [],
    inputDescriptions = entriesFromObject(descriptions).filter(
      (i): i is Extract<typeof i, [string, string]> => typeof i[1] === 'string'
    ),
    outputDescriptionsPrep: OutputDescriptions['returns'] | undefined = (
      descriptions as any
    )?.returns,
    outputDescriptions = !!outputDescriptionsPrep
      ? entriesFromObject(outputDescriptionsPrep)
      : undefined

  const input = <I extends DecipherableInput<K, V>>(input: I) => {
    const { name, type } = input,
      // Find the tag and description for the input
      [tagKey, tagVal] = findTagEntry(name),
      [descKey, descVal] = inputDescriptions.find(([k]) => k === name) || []

    // Set the description and tag to empty values
    const tag = tagKey === name ? tagVal : undefined
    const description = descKey === name ? descVal : undefined

    return {
      name,
      type,
      tag,
      description,
    }
  }

  const output = <O extends DecipherableOutput<K, V>>(output: O) => {
    const { name, type } = output,
      // Find the tag and description for the input
      [tagKey, tagVal] = findTagEntry(name),
      [descKey, descVal] =
        outputDescriptions?.find(
          ([k]) => (k as unknown as typeof name) === name
        ) || []

    // Set the description and tag to empty values
    const tag = (tagKey as typeof name) === name ? tagVal : undefined
    const description =
      (descKey as unknown as typeof name) === name ? descVal : undefined

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

function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>
}
