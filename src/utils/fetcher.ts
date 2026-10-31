export default async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json() as Promise<JSON>
}
