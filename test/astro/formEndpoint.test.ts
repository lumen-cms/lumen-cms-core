import { expect, it } from 'vitest'
import { formEndpoint } from '../../packages/lumen-cms-shared/src/server/formEndpoint'
const request = (body?: string, contentType = 'application/json') => new Request('https://fixture.test/api/form-endpoint', { method: 'POST', body, headers: { 'Content-Type': contentType } })
it('retains the response payload and caller statusMessage override', async () => {
 const response = await formEndpoint(request(JSON.stringify({ name: 'Fixture', choices: ['a', 'b'], statusMessage: 'custom' })))
 expect(response.status).toBe(200)
 expect(await response.json()).toEqual({ name: 'Fixture', choices: ['a', 'b'], statusMessage: 'custom' })
})
it('parses text JSON and URL-encoded repeated fields', async () => {
 expect(await (await formEndpoint(request('{"count":2}', 'text/plain'))).json()).toEqual({ statusMessage: 'ok, data received.', count: 2 })
 expect(await (await formEndpoint(request('name=A%26B&choice=a&choice=b', 'application/x-www-form-urlencoded'))).json()).toEqual({ statusMessage: 'ok, data received.', name: 'A&B', choice: ['a', 'b'] })
})
it('returns missing-body and malformed JSON errors', async () => {
 expect((await formEndpoint(request())).status).toBe(404)
 expect((await formEndpoint(request('null'))).status).toBe(404)
 expect((await formEndpoint(request('{'))).status).toBe(400)
})
it('preserves origin whitelisting and preflight header reflection', async () => {
 const options = new Request('https://fixture.test/api/form-endpoint', { method: 'OPTIONS', headers: { Origin: 'https://allowed.test', 'Access-Control-Request-Headers': 'content-type,x-fixture' } })
 const response = await formEndpoint(options, ['https://allowed.test'])
 expect(response.status).toBe(204)
 expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://allowed.test')
 expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET,OPTIONS,POST')
 expect(response.headers.get('Access-Control-Allow-Headers')).toBe('content-type,x-fixture')
 expect((await formEndpoint(options)).headers.has('Access-Control-Allow-Origin')).toBe(false)
})
