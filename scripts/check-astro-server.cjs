const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const net = require('node:net')
const path = require('node:path')

async function main() {
 const reservation = net.createServer()
 await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve))
 const port = reservation.address().port
 await new Promise(resolve => reservation.close(resolve))
 const child = spawn(process.execPath, [path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture-server/server/entry.mjs')], { env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), ASTRO_TELEMETRY_DISABLED: '1', LUMEN_PREVIEW_SECRET: 'fixture-preview-secret', LUMEN_SITE_URL: 'https://published.fixture.test' }, stdio: ['ignore', 'pipe', 'pipe'] })
 let output = ''
 child.stdout.on('data', chunk => { output += chunk })
 child.stderr.on('data', chunk => { output += chunk })
 const url = `http://127.0.0.1:${port}/api/form-endpoint`
 try {
  let ready = false
  for (let attempt = 0; attempt < 50; attempt++) {
   if (child.exitCode !== null) throw new Error(`Server exited: ${output}`)
   try { const response = await fetch(url); if (response.status === 404) { ready = true; break } } catch {}
   await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(ready, `Server did not become ready: ${output}`)
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' }, body: JSON.stringify({ name: 'Fixture only', count: 2 }) })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:3000')
  assert.deepEqual(await response.json(), { statusMessage: 'ok, data received.', name: 'Fixture only', count: 2 })
  const form = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'http://localhost:3000' }, body: 'choice=a&choice=b' })
  assert.equal(form.status, 200)
  assert.deepEqual(await form.json(), { statusMessage: 'ok, data received.', choice: ['a', 'b'] })
  const preflight = await fetch(url, { method: 'OPTIONS', headers: { Origin: 'http://localhost:3000', 'Access-Control-Request-Headers': 'content-type' } })
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-methods'), 'GET,OPTIONS,POST')
  const origin = `http://127.0.0.1:${port}`
  assert.equal((await fetch(`${origin}/fixture-preview-page`)).status, 401)
  const denied = await fetch(`${origin}/api/preview?secret=wrong`, { redirect: 'manual' })
  assert.equal(denied.status, 401)
  assert.equal(denied.headers.has('set-cookie'), false)
  const entered = await fetch(`${origin}/api/preview?secret=fixture-preview-secret&slug=de/fixture&_storyblok_release=123`, { redirect: 'manual' })
  assert.equal(entered.status, 307)
  assert.equal(entered.headers.get('location'), '/de/fixture?_storyblok_release=123')
  const cookie = entered.headers.get('set-cookie')
  assert.match(cookie, /lumen_preview=/)
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /Secure/i)
  assert.match(cookie, /SameSite=None/i)
  for (const slug of ['_dev_/fixture', '%5Bobject%20Object%5D/fixture']) {
   const missing = await fetch(`${origin}/${slug}`, { headers: { Cookie: cookie.split(';')[0] } })
   assert.equal(missing.status, 404)
   assert.match(missing.headers.get('content-type'), /text\/html/)
   assert.equal(missing.headers.get('cache-control'), 'private, no-store')
   assert.equal(missing.headers.get('x-robots-tag'), 'noindex, nofollow')
   assert.match(await missing.text(), /not found\.\.\./)
  }
  const exited = await fetch(`${origin}/api/exit-preview?slug=de/fixture`, { redirect: 'manual', headers: { Cookie: cookie.split(';')[0] } })
  assert.equal(exited.status, 307)
  assert.equal(exited.headers.get('location'), 'https://published.fixture.test/de/fixture')
  assert.equal((await fetch(`${origin}/fixture-preview-page`, { headers: { Cookie: cookie.split(';')[0] } })).status, 401)
  assert.deepEqual(await (await fetch(`${origin}/api/clear-cache`)).json(), { message: 'Cache flushed' })
  const renderUrl = `${origin}/api/fixture-story-list?source=/fixture-story-render&list=server-list`
  const rendered = await fetch(`${renderUrl}&search__text=special`)
  assert.equal(rendered.status, 200)
  assert.equal(rendered.headers.get('cache-control'), 'private, no-store')
  const fragment = await rendered.json()
  assert.equal(fragment.total, 4)
  assert.match(fragment.html, /data-special-result/)
  assert.match(fragment.html, /SPECIAL/)
  assert.doesNotMatch(fragment.html, /data-lm-list-item/)
  assert.equal((await fetch(`${renderUrl}&page=-1`)).status, 400)
  assert.equal((await fetch(`${origin}/api/fixture-story-list?source=https://example.test&list=server-list`)).status, 400)
  assert.equal((await fetch(`${origin}/api/fixture-story-list?source=/unknown&list=server-list`)).status, 404)
  assert.equal((await fetch(`${origin}/api/fixture-story-list?source=/fixture-story-render&list=unknown`)).status, 404)
  assert.equal((await fetch(renderUrl, { method: 'POST' })).status, 405)
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  try {
   const page = await browser.newPage()
   const errors = []
   page.on('pageerror', error => errors.push(error.message))
   await page.goto(`${origin}/fixture-story-render`)
   await page.locator('[data-normal-result]').waitFor()
   assert.equal(await page.locator('[data-story-template]').count(), 0)
   await page.evaluate(() => { const url = new URL(location.href); url.searchParams.set('search__text', 'special'); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) })
   await page.locator('[data-special-result]').waitFor()
   assert.equal(await page.locator('[data-special-result]').textContent(), 'SPECIAL')
   assert.equal(await page.locator('[data-server-list]').evaluate(node => getComputedStyle(node).borderLeftColor), 'rgb(23, 105, 170)')
   await page.getByRole('button', { name: 'Custom action', exact: true }).click()
   assert.equal(await page.locator('[data-server-action]').textContent(), 'Clicked')
   await page.getByRole('button', { name: 'Go to page 2', exact: true }).click()
   await page.locator('[data-server-item="server-2"]').waitFor()
   await page.evaluate(() => { const url = new URL(location.href); url.searchParams.set('search__text', 'empty'); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) })
   await page.waitForFunction(() => document.querySelector('[data-story-list]').getAttribute('aria-busy') === 'false' && !document.querySelector('[data-story-empty]').hidden)
   assert.equal(await page.locator('[data-story-results]').isVisible(), false)
   let failRenderOnce = true
   await page.route('**/api/fixture-story-list?*', async route => {
    const text = new URL(route.request().url()).searchParams.get('search__text')
    if (text === 'retry' && failRenderOnce) { failRenderOnce = false; await route.fulfill({ status: 503, body: '{}' }); return }
    if (text === 'special slow') await new Promise(resolve => setTimeout(resolve, 200))
    await route.continue()
   })
   const search = async text => page.evaluate(text => { const url = new URL(location.href); url.searchParams.set('search__text', text); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) }, text)
   await search('retry')
   await page.locator('[data-story-error]').waitFor({ state: 'visible' })
   await page.getByRole('button', { name: 'Retry', exact: true }).click()
   await page.waitForFunction(() => document.querySelector('[data-normal-result]')?.textContent === 'retry')
   await search('special slow')
   await search('latest')
   await page.waitForFunction(() => document.querySelector('[data-normal-result]')?.textContent === 'latest')
   await page.waitForTimeout(300)
   assert.equal(await page.locator('[data-normal-result]').textContent(), 'latest')

   assert.equal((await fetch(`${origin}/fixture-cms-preview`)).status, 401)
   const previewLogin = await fetch(`${origin}/api/preview?secret=fixture-preview-secret&slug=fixture-cms-preview`, { redirect: 'manual' })
   const previewCookie = previewLogin.headers.get('set-cookie').split(';')[0]
   const separator = previewCookie.indexOf('=')
   await page.context().addCookies([{ name: previewCookie.slice(0, separator), value: previewCookie.slice(separator + 1), domain: '127.0.0.1', path: '/', httpOnly: true }])
   await page.goto(`${origin}/fixture-cms-preview?_storyblok=42&_storyblok_c=1&_storyblok_tk[space_id]=fixture`, { waitUntil: 'domcontentloaded' })
   await page.waitForFunction(() => typeof window.fixtureStoryblokInput === 'function')
   assert.equal(await page.locator('h1').textContent(), 'Initial heading')
   const previewScripts = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.src))
   assert.deepEqual(previewScripts.filter(src => /ShopifyCart|FastSpringProvider|CustomScripts/.test(src)), [], 'Unconfigured integrations must not add bootstrap scripts')
   const edited = { uuid: 'preview-page', content: { component: 'page', _uid: 'preview-page', meta_title: 'Edited preview', body: [{ component: 'section', _uid: 'preview-section', body: [
    { component: 'headline', _uid: 'preview-heading', _editable: '<!--#storyblok#{"name":"headline","space":"fixture","uid":"preview-heading","id":"42"}-->', text: 'Edited heading', tag: 'h1', styles: [{ component: 'styles', _uid: 'desktop', color: { rgba: 'rgb(0, 80, 120)' } }], styles_mobile: [{ component: 'styles', _uid: 'mobile', color: { rgba: 'rgb(80, 120, 0)' } }] },
    { component: 'tabs', _uid: 'preview-tabs', body: [{ component: 'tabs_item', _uid: 'one', title: 'Editor tab one', body: [{ component: 'headline', _uid: 'one-text', text: 'First editor panel' }] }, { component: 'tabs_item', _uid: 'two', title: 'Editor tab two', body: [{ component: 'headline', _uid: 'two-text', text: 'Second editor panel' }] }] }
   ] }] } }
   await page.evaluate(story => window.fixtureStoryblokInput(story), edited)
   await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Edited heading')
   await page.waitForFunction(() => document.querySelector('[data-lm-tabs]')?.dataset.initialized === 'true')
   assert.match(await page.title(), /Edited preview/)
   assert.equal(await page.locator('h1').evaluate(node => getComputedStyle(node).color), 'rgb(0, 80, 120)')
   assert.equal(await page.locator('h1').getAttribute('data-blok-uid'), '42-preview-heading')
   await page.setViewportSize({ width: 375, height: 812 })
   assert.equal(await page.locator('h1').evaluate(node => getComputedStyle(node).color), 'rgb(80, 120, 0)')
   await page.getByRole('tab', { name: 'Editor tab two' }).click()
   assert.match(await page.getByRole('tabpanel').innerText(), /Second editor panel/)
   const withoutStyles = structuredClone(edited)
   withoutStyles.content.body[0].body[0].text = 'Styles removed'
   delete withoutStyles.content.body[0].body[0].styles
   delete withoutStyles.content.body[0].body[0].styles_mobile
   await page.evaluate(story => window.fixtureStoryblokInput(story), withoutStyles)
   await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Styles removed')
   assert.notEqual(await page.locator('h1').evaluate(node => getComputedStyle(node).color), 'rgb(80, 120, 0)')
   await page.waitForFunction(() => document.querySelector('[data-lm-tabs]')?.dataset.initialized === 'true')
   await page.getByRole('tab', { name: 'Editor tab two' }).click()
   assert.match(await page.getByRole('tabpanel').innerText(), /Second editor panel/)
   await fetch(`${origin}/api/exit-preview?slug=fixture-cms-preview`, { redirect: 'manual', headers: { Cookie: previewCookie } })
   await page.evaluate(() => { window.fixturePreviewRejected = false; document.addEventListener('lumen:preview-error', () => window.fixturePreviewRejected = true, { once: true }) })
   await page.evaluate(story => window.fixtureStoryblokInput(story), edited)
   await page.waitForFunction(() => window.fixturePreviewRejected === true)
   assert.equal(await page.locator('h1').textContent(), 'Styles removed')
   assert.deepEqual(errors, [])
  } finally { await browser.close() }
  console.log('Astro standalone API checks passed (local fixture requests only).')
 } finally {
  if (child.exitCode === null) { child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve)) }
 }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
