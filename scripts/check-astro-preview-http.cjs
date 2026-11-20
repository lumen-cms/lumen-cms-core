// Build first: pnpm --filter lumen-cms-astro exec astro build --config astro.server.config.mjs
// Real HTTP + SDK middleware + Astro HTML rendering, without CMS credentials.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const net = require('node:net')
const path = require('node:path')
const fs = require('node:fs')
const { load } = require('cheerio')

async function main() {
 const reservation = net.createServer()
 await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve))
 const port = reservation.address().port
 await new Promise(resolve => reservation.close(resolve))
 const origin = `http://127.0.0.1:${port}`
 const server = spawn(process.execPath, [path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture-server/server/entry.mjs')], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), LUMEN_PREVIEW_SECRET: 'fixture-preview-secret' }, stdio: ['ignore', 'pipe', 'pipe'],
 })
 let output = ''
 server.stdout.on('data', data => { output += data }); server.stderr.on('data', data => { output += data })
 try {
  let ready = false
  for (let i = 0; i < 50; i++) {
   try { ready = (await fetch(`${origin}/fixture-cms-preview`)).status === 401 } catch {}
   if (ready) break
   await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(ready, output)
  const login = await fetch(`${origin}/api/preview?secret=fixture-preview-secret&slug=fixture-cms-preview`, { redirect: 'manual' })
  assert.equal(login.status, 307)
  const cookie = login.headers.get('set-cookie').split(';')[0]
  const url = `${origin}/fixture-cms-preview?_storyblok=42&_storyblok_c=1&_storyblok_tk[space_id]=fixture`
  const durations = []
  for (let i = 0; i < 5; i++) {
   const story = { uuid: 'preview-page', full_slug: 'fixture-cms-preview', is_storyblok_preview: true, content: { component: 'page', _uid: 'preview-page', body: [
    { component: 'card_list', _uid: 'cards', body: [
     { component: 'card_list_item', _uid: 'card', title: `Unsaved title ${i}`, card_actions_body: [], body: [] },
    ] },
    { component: 'card', _uid: 'empty', body_above_media: [], body: [], body_actions: [], body_on_hover: [] },
   ] } }
   const started = performance.now()
   const response = await fetch(url, { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ story }) })
   const html = await response.text()
   durations.push(performance.now() - started)
   assert.equal(response.status, 200)
   const $ = load(html)
   assert.equal($('html[data-lumen-preview]').length, 1)
   assert.equal($('.lm-card').text().trim(), `Unsaved title ${i}`)
   assert.equal($('.lm-card .MuiCardActions-root').length, 0)
  }
  const initial = await fetch(url, { headers: { Cookie: cookie } })
  assert.match(await initial.text(), /Initial heading/)
  const results = { scenario: 'Local Astro SSR fixture, SDK middleware, unsaved card payload; no remote CMS calls', milliseconds: durations }
  if (process.env.PREVIEW_SSR_BENCHMARK_OUTPUT) fs.writeFileSync(process.env.PREVIEW_SSR_BENCHMARK_OUTPUT, JSON.stringify(results, null, 2))
  console.log('PASS: five SDK preview POSTs rendered edited cards without zero text; subsequent GET retained original content.', JSON.stringify(results))
 } finally {
  if (server.exitCode === null) { server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve)) }
 }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
