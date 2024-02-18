import { MethodMeta } from '@inverter-network/abis'
import { Entries, Except } from 'type-fest'
import { Inputs } from '.'

type InputWithoutComponents = Omit<Inputs[number], 'components'>
type NonComponentInput = Exclude<Inputs[number], { type: 'tuple[]' }>
type ComponentInput = Extract<
  Inputs[number],
  { type: 'tuple[]' }
>['components'][number]

export default function useDecipher({
  methodMeta: { descriptions, tags },
}: {
  methodMeta: MethodMeta
}) {
  // Get the entries from the descriptions and tags
  const descriptionsEntries = entriesFromObject(
      // @ts-expect-error union type conflict
      descriptions as Except<typeof descriptions, 'returns'>
    ),
    tagEntries = entriesFromObject(tags)

  const findTagEntry = (name: string) =>
      tagEntries.find(([k]) => k === name) || [],
    findDescEntry = (name: string) =>
      descriptionsEntries.find(([k]) => k === name) || []

  // Top level Itterator
  const decipher = ({
    name,
    type,
  }: NonComponentInput | ComponentInput | InputWithoutComponents) => {
    const [tagKey, tagVal] = findTagEntry(name),
      [descKey, descVal] = findDescEntry(name)

    // Set the description and tag to empty values
    const description = descKey === name ? descVal : undefined,
      tag = tagKey === name ? tagVal : undefined

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
