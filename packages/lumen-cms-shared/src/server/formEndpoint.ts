/** Native Request/Response equivalent of the existing echo-style form endpoint. */
export async function formEndpoint(request: Request, whitelist: readonly string[] = []) {
 const headers = new Headers({ Vary: 'Origin' })
 const origin = request.headers.get('origin')
 if (origin && [...whitelist, 'http://localhost:6006', 'http://localhost:3000'].includes(origin)) headers.set('Access-Control-Allow-Origin', origin)
 if (request.method === 'OPTIONS') {
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  headers.append('Vary', 'Access-Control-Request-Headers')
  const requestedHeaders = request.headers.get('access-control-request-headers')
  if (requestedHeaders) headers.set('Access-Control-Allow-Headers', requestedHeaders)
  return new Response(null, { status: 204, headers })
 }
 const json = (value: unknown, status = 200) => { headers.set('Content-Type', 'application/json; charset=utf-8'); return new Response(JSON.stringify(value), { status, headers }) }
 const text = await request.text()
 let body: unknown
 try {
  if (request.headers.get('content-type')?.split(';')[0] === 'application/x-www-form-urlencoded') {
   const values: Record<string, string | string[]> = {}
   for (const [key, value] of new URLSearchParams(text)) {
    const previous = Object.hasOwn(values, key) ? values[key] : undefined
    Object.defineProperty(values, key, { value: previous === undefined ? value : Array.isArray(previous) ? [...previous, value] : [previous, value], enumerable: true, configurable: true })
   }
   body = values
  } else body = text ? JSON.parse(text) : undefined
 } catch { return json({ error: 'Invalid JSON' }, 400) }
 return body ? json({ statusMessage: 'ok, data received.', ...Object(body) }) : json({ error: 'request body not found.' }, 404)
}
