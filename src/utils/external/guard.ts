import { HTTPError } from '@/utils/external/error'

/**
 * Asserts that a value is not undefined or null
 * @template T - The type of the value
 * @param value - The value to assert
 * @param message - The message to throw if the value is undefined or null
 * @throws HTTPError if the value is undefined or null
 */
export function authorized<T>(
  value: T | undefined | null,
  message?: string
): asserts value is T {
  if (!value)
    throw new HTTPError(
      !!message ? `Unauthorized: ${message}` : 'Unauthorized',
      401
    )
}

/**
 * Asserts that a value is not undefined or null
 * @template T - The type of the value
 * @param value - The value to assert
 * @param message - The message to throw if the value is undefined or null
 * @throws HTTPError if the value is undefined or null
 */
export function isNotEmpty<T>(
  value: T | undefined | null,
  message?: string
): asserts value is T {
  if (!value)
    throw new HTTPError(
      !!message ? `No Data Found: ${message}` : 'No Data Found',
      404
    )
}
