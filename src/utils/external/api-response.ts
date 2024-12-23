/**
 *
 * @param call Promise function
 * @param successStatus Optional success status code ( default 200 )
 * @param errorStatus Optional error status code ( default 500 )
 * @returns Response with the result of the promise and the status code
 */
export async function apiResponse<T>(
  call: () => Promise<T>,
  successStatus = 200,
  errorStatus = 500
) {
  try {
    const result = await call()
    if (typeof result === 'object' || Array.isArray(result)) {
      return Response.json(result, { status: successStatus })
    }

    if (
      typeof result === 'string' ||
      typeof result === 'number' ||
      typeof result === 'boolean'
    ) {
      return new Response(result.toString(), { status: successStatus })
    }

    throw new Error('Unexpected Content Type: Could not return a response')
  } catch (err: any) {
    return new Response(
      err?.message || 'Unexpected: Could not retrieve any error messages',
      {
        status: err?.statusCode ?? errorStatus,
      }
    )
  }
}
