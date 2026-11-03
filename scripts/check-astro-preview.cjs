// Build first: pnpm --filter lumen-cms-astro exec astro build --config astro.server.config.mjs
// Exercises the actual official Bridge in an iframe; no live CMS credentials.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const net = require('node:net')
const path = require('node:path')
const { chromium } = require('playwright')

async function main() {
 const reservation = net.createServer()
 await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve))
 const port = reservation.address().port
 await new Promise(resolve => reservation.close(resolve))
 const origin = `http://127.0.0.1:${port}`
 const server = spawn(process.execPath, [path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture-server/server/entry.mjs')], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), LUMEN_PREVIEW_SECRET: 'fixture-preview-secret' }, stdio: ['ignore', 'pipe', 'pipe'],
 })
 let output = '', browser
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
  const cookie = login.headers.get('set-cookie').split(';')[0], separator = cookie.indexOf('=')
  browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.context().addCookies([{ name: cookie.slice(0, separator), value: cookie.slice(separator + 1), domain: '127.0.0.1', path: '/', httpOnly: true }])
  const previewUrl = `${origin}/fixture-cms-preview?_storyblok=42&_storyblok_c=1&_storyblok_tk[space_id]=fixture`
  await page.route(`${origin}/editor-fixture`, route => route.fulfill({ contentType: 'text/html', body: `<iframe src="${previewUrl}"></iframe>` }))
  await page.goto(`${origin}/editor-fixture`)
  const frame = await page.locator('iframe').contentFrame()
  await frame.locator('.storyblok__hint').waitFor({ state: 'attached' })
  assert.equal(await frame.locator('.storyblok__hint').count(), 1)
  const story = { uuid: 'preview-page', content: { component: 'page', _uid: 'preview-page', meta_title: 'Rich text preview', body: [{ component: 'section', _uid: 'section', body: [
   { component: 'rich_text_editor', _uid: 'instant-rich', body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Initial rich text' }] }] } },
  ] }] } }
  // Dispatch to the real Bridge message listener, as the editor does.
  const send = story => window.dispatchEvent(new MessageEvent('message', { origin: 'https://app.storyblok.com', data: { action: 'input', story } }))
  const child = page.frames().find(frame => frame.url().includes('/fixture-cms-preview'))
  await child.evaluate(send, story)
  await frame.locator('[data-lm-richtext="instant-rich"]').waitFor()
  assert.equal(await frame.locator('.storyblok__hint').count(), 1, 'Reconciliation must preserve the Bridge controls')
  let posts = 0
  page.on('request', request => { if (request.method() === 'POST' && request.url().includes('/fixture-cms-preview')) posts++ })
  const reconciled = page.waitForResponse(response => response.request().method() === 'POST' && response.url().includes('/fixture-cms-preview'))
  const timing = await child.evaluate(story => {
   const element = document.querySelector('[data-lm-richtext="instant-rich"]'), paragraph = element.querySelector('p')
   const started = performance.now()
   for (let i = 0; i < 20; i++) {
    story.content.body[0].body[0].body.content[0].content[0].text = `Typing ${i}`
    window.dispatchEvent(new MessageEvent('message', { origin: 'https://app.storyblok.com', data: { action: 'input', story: structuredClone(story) } }))
    if (element.textContent !== `Typing ${i}`) throw new Error('Typing waited for a server response')
   }
   return { milliseconds: performance.now() - started, preserved: element.querySelector('p') === paragraph }
  }, story)
  assert.equal(timing.preserved, true)
  assert.equal(posts, 0, 'Every keystroke must paint before any POST')
  assert.ok(timing.milliseconds < 100, `20 updates took ${timing.milliseconds} ms`)
  assert.equal((await reconciled).status(), 200)
  assert.equal(posts, 1, 'One reconciliation POST per typing burst')
  await frame.locator('[data-lm-richtext="instant-rich"]').filter({ hasText: 'Typing 19' }).waitFor()
  assert.deepEqual(errors, [])
  console.log(`PASS: 20 rich-text edits in ${timing.milliseconds.toFixed(1)} ms before network; one SDK reconciliation POST; real Bridge in iframe.`)
 } finally {
  await browser?.close()
  if (server.exitCode === null) { server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve)) }
 }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
