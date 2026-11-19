import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile, symlink, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import { createRequire } from 'node:module'
import http from 'node:http'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../', import.meta.url))
const pkg = resolve(root, 'packages/lumen-cms-astro')
const requireAstro = createRequire(resolve(pkg, 'package.json'))
const { build } = await import(requireAstro.resolve('astro'))
const base = resolve(root, '.website-tests/consent')
await rm(base, { recursive: true, force: true })
await mkdir(base, { recursive: true })
let server, browser
try {
 browser = await chromium.launch({ headless: true })
 for (const mode of ['basic', 'gtm', 'none']) {
  const gtm = mode === 'gtm', noTracking = mode === 'none'
  const fixture = resolve(base, mode)
  await mkdir(resolve(fixture, 'src/pages'), { recursive: true })
  await symlink(resolve(pkg, 'node_modules'), resolve(fixture, 'node_modules'), 'dir')
  await writeFile(resolve(fixture, 'package.json'), JSON.stringify({ type: 'module' }))
  await writeFile(resolve(fixture, 'astro.config.mjs'), `
import tailwindcss from ${JSON.stringify(requireAstro.resolve('@tailwindcss/vite'))}
import lumenStoryblok from ${JSON.stringify(resolve(pkg, 'integration.mjs'))}
export default { output: 'static', integrations: [lumenStoryblok()], vite: { plugins: [tailwindcss()], ssr: { noExternal: ['lumen-cms-shared'] }, define: {
 'process.env.PUBLIC_GTM_CONTAINER': ${JSON.stringify(JSON.stringify(gtm ? 'GTM-FIXTURE' : '  '))},
 'process.env.PUBLIC_GA': 'undefined',
 'process.env.LUMEN_SPEED_INSIGHTS': ${JSON.stringify(JSON.stringify(noTracking ? '0' : '1'))},
 'process.env.VERCEL_ENV': '\"production\"'
} } }
`)
  await writeFile(resolve(fixture, 'src/pages/[locale].astro'), `---
import SiteLayout from ${JSON.stringify(resolve(pkg, 'src/layouts/SiteLayout.astro'))}
export function getStaticPaths() { return ['de','en','fr','es','it','nl','id'].map(locale => ({ params: { locale } })) }
const page = {
 locale: Astro.params.locale, defaultLocale: 'en', insideStoryblok: false,
 settings: { component: 'global', _uid: 'settings', theme_base: 'base', website_title: 'Consent fixture',
 ${noTracking ? '' : "setup_google_analytics: 'G-CONSENT', setup_facebook_pixel: '123', setup_ad_roll_adv_id: 'ADV', setup_ad_roll_pix_id: 'PIX',"}
 scripts: [
  ${noTracking ? '' : "{ component: 'script', _uid: 'cms-before', url: '/cms-before.js', strategy: 'beforeInteractive' }, { component: 'script', _uid: 'cms-analytics', url: '/cms-analytics.js', attributes: 'data-consent-category=analytics' },"}
  { component: 'script', _uid: 'cms-essential', url: '/cms-essential.js', attributes: 'data-consent-category=necessary', strategy: 'beforeInteractive' }
 ] },
 page: { component: 'page', _uid: 'page', property: ['disable_promotion'], body: [] },
}
---
<SiteLayout page={page}><h1>Consent fixture</h1><p>A shared website theme with separate analytics and marketing choices.</p></SiteLayout>`)
  await build({ root: fixture, logLevel: 'error' })
  const output = resolve(fixture, 'dist')
  server = http.createServer(async (req, res) => {
   const path = new URL(req.url, 'http://localhost').pathname
   if (path.endsWith('.js') && (path.startsWith('/cms-') || path.startsWith('/_vercel/'))) {
    res.setHeader('Content-Type', 'text/javascript'); res.end(''); return
   }
   try {
    const file = join(output, path.endsWith('/') ? path + 'index.html' : path)
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html')
    res.end(await readFile(file))
   } catch { res.writeHead(404).end() }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const context = await browser.newContext()
  const requests = [], errors = []
  await context.route('**/*', async route => {
   const url = new URL(route.request().url())
   requests.push(url.href)
   if (url.origin === origin) return route.continue()
   return route.fulfill({ contentType: url.hostname === 'fonts.googleapis.com' ? 'text/css' : 'text/javascript', body: '' })
  })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(origin + '/de/', { waitUntil: 'networkidle' })
  const vendor = url => /googletagmanager|facebook\.net|adroll\.com|cms-before|cms-analytics|_vercel\/speed-insights/.test(url)
  if (noTracking) {
   assert.equal(await page.locator('[data-lm-consent]').count(), 0)
   assert.equal(await page.locator('html').getAttribute('data-lumen-consent'), null)
   assert.deepEqual(requests.filter(vendor), [])
   assert(requests.some(url => url.includes('cms-essential.js')))
   console.log('No trackers: no banner, no optional requests, necessary scripts remain functional.')
  } else if (gtm) {
   assert.equal(await page.locator('[data-lm-consent]').count(), 0)
   assert.equal(await page.locator('html').getAttribute('data-lumen-consent'), null)
   await page.waitForFunction(() => !!window.gtag)
   assert(requests.some(url => url.includes('gtm.js?id=GTM-FIXTURE')))
   assert(requests.some(url => url.includes('cms-before.js')))
   console.log('GTM: no shared UI or consent gating; existing integrations load.')
  } else {
   const noScriptContext = await browser.newContext({ javaScriptEnabled: false })
   const noScriptRequests = []
   await noScriptContext.route('**/*', async route => {
    const url = new URL(route.request().url())
    noScriptRequests.push(url.href)
    if (url.origin === origin) return route.continue()
    return route.fulfill({ contentType: 'text/css', body: '' })
   })
   const noScriptPage = await noScriptContext.newPage()
   await noScriptPage.goto(origin + '/en/', { waitUntil: 'networkidle' })
   assert.deepEqual(noScriptRequests.filter(vendor), [], 'No noscript tracking bypass')
   await noScriptContext.close()
   const dialog = page.locator('#lm-consent-dialog')
   const banner = page.locator('[data-consent-banner]')
   assert.equal(await dialog.evaluate(el => el.open), false)
   assert.equal(await banner.isVisible(), true)
   assert((await banner.boundingBox()).height < 180, 'Desktop banner stays compact')
   assert.deepEqual(requests.filter(vendor), [], 'No optional requests before choice')
   assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined')
   assert.equal(await page.locator('script[type="text/partytown"], noscript img').count(), 0)
   assert(requests.some(url => url.includes('cms-essential.js')))
   // Visual QA and layout checks at both common viewport sizes.
   await page.screenshot({ path: resolve(base, 'desktop.png') })
   await page.setViewportSize({ width: 390, height: 844 })
   await page.screenshot({ path: resolve(base, 'mobile.png') })
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
   assert((await banner.boundingBox()).height < 340, 'Mobile banner leaves the page visible')
   for (const button of await banner.locator('button').all()) {
    const box = await button.boundingBox(); assert(box && box.x >= 0 && box.x + box.width <= 390)
   }
   await page.addScriptTag({ path: resolve(root, 'node_modules/axe-core/axe.min.js') })
   const violations = await page.evaluate(async () => (await window.axe.run('[data-lm-consent]', { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations)
   assert.deepEqual(violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [])
   await page.getByRole('button', { name: 'Einstellungen', exact: true }).click()
   assert.equal(await dialog.evaluate(el => el.open), true)
   assert.equal(await dialog.getByRole('checkbox').count(), 2)
   assert.equal(await banner.isVisible(), false)
   await page.screenshot({ path: resolve(base, 'mobile-settings.png') })
   const settingsViolations = await page.evaluate(async () => (await window.axe.run('[data-lm-consent]', { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations)
   assert.deepEqual(settingsViolations.map(v => v.id), [])
   await page.keyboard.press('Escape')
   await banner.waitFor({ state: 'visible' })
   assert.equal(await page.getByRole('button', { name: 'Einstellungen', exact: true }).evaluate(el => el === document.activeElement), true)
   assert.deepEqual(requests.filter(vendor), [], 'Opening and dismissing settings grants nothing')
   await page.getByRole('button', { name: 'Alle ablehnen', exact: true }).click()
   await page.reload({ waitUntil: 'networkidle' })
   assert.equal(await dialog.evaluate(el => el.open), false)
   assert.deepEqual(requests.filter(vendor), [], 'Reject stays blocked after reload')
   await page.getByRole('button', { name: 'Datenschutzeinstellungen', exact: true }).click()
   await page.getByRole('checkbox', { name: 'Analytics', exact: true }).check()
   await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click()
   await page.waitForFunction(() => document.querySelector('script[src*="/gtag/js"]'))
   await page.waitForLoadState('networkidle')
   assert(requests.some(url => url.includes('/gtag/js')))
   assert(requests.some(url => url.includes('cms-analytics.js')))
   assert(requests.some(url => url.includes('/_vercel/speed-insights/')))
   assert(!requests.some(url => /facebook\.net|adroll\.com|cms-before/.test(url)))
   const queue = await page.evaluate(() => window.dataLayer.map(args => [...args]))
   assert.deepEqual(queue.slice(0, 2).map(args => args.slice(0, 2)), [['consent', 'default'], ['consent', 'update']])
   assert.equal(queue.filter(args => args[0] === 'config').length, 1)
   assert.equal(queue.filter(args => args[0] === 'event' && args[1] === 'page_view').length, 0)
   await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')))
   assert.equal(requests.filter(url => url.includes('/gtag/js')).length, 1)
   await page.getByRole('button', { name: 'Datenschutzeinstellungen', exact: true }).click()
   await page.getByRole('button', { name: 'Alle akzeptieren', exact: true }).click()
   await page.waitForFunction(() => document.querySelector('script[src*="adroll.com"]'))
   await page.waitForLoadState('networkidle')
   assert(requests.some(url => /facebook\.net/.test(url)))
   assert(requests.some(url => /adroll\.com/.test(url)))
   assert(requests.some(url => /cms-before/.test(url)))
   // Consent is origin-wide across languages and all seven translations render.
   for (const locale of ['en', 'fr', 'es', 'it', 'nl', 'id']) {
    await page.goto(origin + '/' + locale + '/', { waitUntil: 'networkidle' })
    assert.equal(await dialog.evaluate(el => el.open), false)
    assert.equal(await page.locator('html').getAttribute('lang'), locale)
   }
   await page.goto(origin + '/de/', { waitUntil: 'networkidle' })
   const other = await context.newPage()
   await other.goto(origin + '/de/', { waitUntil: 'networkidle' })
   await page.getByRole('button', { name: 'Datenschutzeinstellungen', exact: true }).click()
   requests.length = 0
   await Promise.all([
    page.waitForEvent('load'), other.waitForEvent('load'),
    page.getByRole('button', { name: 'Alle ablehnen', exact: true }).click(),
   ])
   await page.waitForLoadState('networkidle'); await other.waitForLoadState('networkidle')
   assert.deepEqual(requests.filter(vendor), [], 'Withdrawal reloads both tabs without optional trackers')
   assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined')
   // Marketing alone must never load Google Analytics.
   await page.getByRole('button', { name: 'Datenschutzeinstellungen', exact: true }).click()
   await page.getByRole('checkbox', { name: 'Marketing', exact: true }).check()
   await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click()
   await page.waitForLoadState('networkidle')
   await page.waitForFunction(() => document.querySelector('script[src*="facebook.net"]'))
   assert(!requests.some(url => url.includes('/gtag/js')))
   assert(requests.some(url => /facebook\.net/.test(url)))
   assert.deepEqual(errors, [])
   console.log('Basic: zero optional requests before consent/rejection; independent categories; one GA config; persistence; seven locales; cross-tab withdrawal; mobile and accessibility passed.')
  }
  await context.close()
  await new Promise(resolve => server.close(resolve)); server = undefined
 }
 console.log(`Consent screenshots: ${base}`)
} finally {
 await browser?.close()
 if (server) await new Promise(resolve => server.close(resolve))
}
