/** Bounded retries for idempotent upstream reads only. Never wrap mutations. */
export async function retryRead<T>(read: () => Promise<T>, retryable: (error: unknown) => boolean = transientReadError): Promise<T> {
 for (let attempt = 0; ; attempt++) {
  try { return await read() }
  catch (error) {
   if (attempt >= 2 || !retryable(error)) throw error
   await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt))
  }
 }
}

function transientReadError(error: unknown) {
 const value = error as { message?: string; response?: { status?: number }; status?: number }
 const status = value?.response?.status ?? value?.status
 return status === 429 || (typeof status === 'number' && status >= 500) ||
  (error instanceof TypeError && /fetch failed|network/i.test(error.message))
}
