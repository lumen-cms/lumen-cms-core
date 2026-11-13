const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const http = require('node:http')
const path = require('node:path')
async function main() {
 const { StatelessStateStore } = await import('../packages/lumen-cms-astro/node_modules/@auth0/auth0-server-js/dist/index.js')
 const jar = new Map()
 const secret = 'test-session-secret-'.repeat(4)
 const store = new StatelessStateStore({ secret }, { getCookie: name => jar.get(name), getCookies: () => Object.fromEntries(jar), setCookie: (name, value) => jar.set(name, value), deleteCookie: name => jar.delete(name) })
 await store.set('lumen_auth', { user: { sub: 'fixture-user', email: 'buyer@example.test', given_name: 'Ada', roles: ['reader'], confidential: 'never-send' }, idToken: undefined, refreshToken: undefined, tokenSets: [], internal: { sid: 'fixture', createdAt: Math.floor(Date.now() / 1000) } })
 const reservation = http.createServer()
 await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve))
 const port = reservation.address().port
 await new Promise(resolve => reservation.close(resolve))
 const origin = `http://127.0.0.1:${port}`
 const child = spawn(process.execPath, [path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture-server/server/entry.mjs')], { env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), LUMEN_AUTH_ENABLED: '1', LUMEN_BUILD_MODE: 'public', LUMEN_SITE_URL: origin, AUTH0_DOMAIN: 'fixture.auth0.com', AUTH0_CLIENT_ID: 'fixture', AUTH0_CLIENT_SECRET: 'fixture-secret', AUTH0_SESSION_SECRET: secret }, stdio: ['ignore', 'pipe', 'pipe'] })
 let output = ''; child.stdout.on('data', data => { output += data }); child.stderr.on('data', data => { output += data })
 try {
  let response
  for (let attempt = 0; attempt < 100; attempt++) {
   try { response = await fetch(origin + '/api/auth/session'); break } catch { await new Promise(resolve => setTimeout(resolve, 100)) }
  }
  assert.ok(response, output); assert.equal(response.status, 200, output)
  assert.deepEqual(await response.json(), { user: null })
  const cookie = [...jar].map(([key, value]) => `${key}=${value}`).join('; ')
  response = await fetch(origin + '/api/auth/session', { headers: { cookie } })
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  const body = await response.json()
  assert.equal(body.user.sub, 'fixture-user'); assert.deepEqual(body.user.roles, ['reader'])
  assert.equal(JSON.stringify(body).includes('never-send'), false)
  response = await fetch(origin + '/refetch', { redirect: 'manual', headers: { cookie } })
  assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/')
  response = await fetch(origin + '/api/account', { method: 'DELETE', headers: { cookie } })
  assert.equal(response.status, 403)
  response = await fetch(origin + '/api/auth/session', { headers: { cookie: 'lumen_auth=tampered' } })
  assert.deepEqual(await response.json(), { user: null })
  console.log('Built auth endpoints pass: guest, encrypted SDK session, profile allowlist, no-store, refetch, CSRF, tampered cookie.')
 } finally { child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
