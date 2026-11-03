// Build production output, then measure the JS actually requested by each page.
// Emitted (but unrequested) chunks are not counted as page downloads.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const http = require('node:http')
const { spawnSync } = require('node:child_process')
const { gzipSync } = require('node:zlib')
const { chromium } = require('playwright')
const { checkDeferredLifecycle } = require('./astro-deferred-lifecycle.cjs')
const { checkShopifyCheckout, checkShopifyLoadFailure } = require('./astro-shopify-checkout.cjs')
const sites = require('../test/websites/sites.json')
const root = path.resolve(__dirname, '..')
const site = process.argv[2] || 'fixture'
assert(site === 'fixture' || Object.hasOwn(sites, site), 'Expected fixture, bali, planet, or upskill')
const reportDir = path.join(root, '.website-tests/bundle-audit', site)
fs.mkdirSync(reportDir, { recursive: true })
const buildLog = fs.openSync(path.join(reportDir, 'build.log'), 'w')
const command = site === 'fixture' ? 'pnpm' : process.execPath
const args = site === 'fixture' ? ['--filter', 'lumen-cms-astro', 'build'] : ['scripts/astro-site.cjs', site, 'build', '--sample', '--limit=3']
const result = spawnSync(command, args, { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', LUMEN_RUNTIME_AUDIT_DIR: reportDir }, stdio: ['ignore', buildLog, buildLog] })
fs.closeSync(buildLog)
if (result.error) throw result.error
assert.equal(result.status, 0, `Production build failed; see ${reportDir}/build.log`)

const chunks = new Map()
for (const file of fs.readdirSync(reportDir).filter(file => file.endsWith('.json') && file !== 'pages.json')) {
 const audit = JSON.parse(fs.readFileSync(path.join(reportDir, file)))
 for (const chunk of audit.chunkDetails || []) {
  // Client assets live under _astro; SSR chunks must never inflate this audit.
  if (chunk.file.startsWith('_astro/')) chunks.set('/' + chunk.file, chunk)
 }
}
const output = path.join(root, 'packages/lumen-cms-astro/dist', site)
const routes = site === 'fixture' ? ['text', 'tabs', 'swiper', 'advanced', 'slider', 'images', 'lightbox', 'shopify', 'shopify-checkout', 'calendar', 'calendar-month', 'calendar-below', 'advanced-below', 'parallax-below', 'youtube-light', 'list', 'video'].map(name => `/bundle-fixtures/${name}/`) : sites[site].routes.slice(0, 3)

async function main() {
 const server = http.createServer((req, res) => {
  try {
   const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
   let file = path.resolve(output, '.' + pathname)
   if (!file.startsWith(output + path.sep) && file !== output) { res.writeHead(403).end(); return }
   if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
   res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html')
   res.end(fs.readFileSync(file))
  } catch { res.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 let browser
 const pages = []
 try {
  browser = await chromium.launch()
  const origin = `http://127.0.0.1:${server.address().port}`
  for (const route of routes) {
   // Fresh context per page: cached requests cannot hide a dependency.
   const context = await browser.newContext()
   const page = await context.newPage()
   const requested = new Set()
   const errors = []
   page.on('pageerror', error => errors.push(error.message))
   page.on('request', req => {
    const url = new URL(req.url())
    if (url.origin === origin && url.pathname.endsWith('.js')) requested.add(url.pathname)
   })
   await page.route('**/*', handler => new URL(handler.request().url()).origin === origin ? handler.continue() : handler.abort())
   if (route.includes('youtube-light')) await page.addInitScript(() => {
    // Use the real provider module, with a local stand-in for YouTube's remote API.
    window.YT = { PlayerState: { PLAYING: 1, PAUSED: 2, ENDED: 0, BUFFERING: 3 }, Player: function (_iframe, config) {
     queueMicrotask(() => config.events.onReady())
     return { addEventListener() {}, removeEventListener() {}, setVolume() {}, getVolume: () => 100, mute() {}, unMute() {}, isMuted: () => false, pauseVideo() {}, playVideo() {}, getDuration: () => 10, getCurrentTime: () => 0, getPlayerState: () => 2, destroy() {}, getVideoLoadedFraction: () => 1, getPlaybackRate: () => 1 }
    } }
   })
   const response = await page.goto(origin + route, { waitUntil: 'networkidle' })
   assert.equal(response.status(), 200, route)
   if (route.includes('/tabs/')) {
    await page.getByRole('tab', { name: 'Second', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.includes('Second'))
   }
   if (route.includes('/advanced/')) await page.waitForSelector('.swiper-initialized')
   if (route.includes('/lightbox/')) await page.getByRole('button', { name: 'Image two', exact: true }).click()
   if (/\/shopify(?:-checkout)?\//.test(route)) await page.getByRole('button', { name: 'Large', exact: true }).click()
   if (route.includes('/shopify-checkout/')) {
    await page.locator('[data-shopify-add] button').click()
    const cart = page.getByRole('dialog', { name: 'Shopping cart' })
    await cart.getByRole('button', { name: 'Increase Large quantity' }).click()
    await cart.getByRole('button', { name: 'Decrease Large quantity' }).click()
    await cart.getByRole('button', { name: 'Close shopping cart' }).click()
   }
   if (/\/calendar(?:-month)?\//.test(route)) await page.waitForSelector('[data-calendar-initialized="true"] [data-date]')
   if (route.includes('/video/')) await page.waitForSelector('[data-player-ready="active"] video')
   const modules = [...requested].flatMap(file => {
    assert(chunks.has(file), `Missing bundle metadata for ${file}`)
    return chunks.get(file).modules
   })
   const hasModule = pattern => modules.some(id => pattern.test(id))
   const features = {
    swiper: hasModule(/node_modules\/swiper\//),
    calendar: hasModule(/node_modules\/fullcalendar\//),
    mediaProviders: hasModule(/node_modules\/(?:@mux\/mux-player|(?:hls|dash|youtube|vimeo|wistia|spotify|twitch|tiktok)-video-element|spotify-audio-element)\//),
    shopify: hasModule(/client\/shopify|lumen-cms-shared\/src\/shopify\.ts|components\/Shopify.*\.astro/),
    checkoutSdk: hasModule(/shopify-graphql-request|generated\/shopify-schema|node_modules\/(?:graphql|graphql-request|graphql-tag)\//),
    parallax: hasModule(/node_modules\/parallax-controller\//),
    storyClient: hasModule(/node_modules\/storyblok-js-client\//),
    editor: hasModule(/storyblok.*(?:preview-bridge|live-preview)|client\/storyblokPreview/),
   }
   assert.equal(features.checkoutSdk, false, `${route}: checkout SDK loaded before checkout`)
   const usesShopify = await page.locator('[data-lm-shopify-product],[data-lm-shopify-cart]').count() > 0
   assert.equal(features.shopify, usesShopify, `${route}: Shopify runtime isolation`)
   assert.equal(features.editor, false, `${route}: public page loaded editor code`)
   assert.equal(hasModule(/node_modules\/@storyblok\//), false, `${route}: public page loaded the Storyblok SDK`)
   assert.equal(await page.locator('#__STORYBLOK_SERVERDATA__').count(), 0, `${route}: public page serialized preview data`)
   if (site === 'fixture') {
    assert.equal(features.swiper, route.includes('/advanced/'), `${route}: Swiper isolation`)
    assert.equal(hasModule(/client\/nativeCarousel/), /\/(swiper|slider|lightbox|shopify|shopify-checkout)\//.test(route), `${route}: native carousel isolation`)
    assert.equal(features.calendar, /\/calendar(?:-month)?\//.test(route), `${route}: calendar isolation`)
    assert.equal(features.mediaProviders, false, `${route}: native video must not load third-party players`)
    assert.equal(features.parallax, false, `${route}: parallax must wait for visibility`)
    assert.equal(features.storyClient, false, `${route}: legacy list SDK must wait for a request`)
    const allowed = {
     text: [], tabs: ['Tabs'], swiper: ['NativeSlider'], advanced: ['AdvancedSwiper'], slider: ['NativeSlider'], images: [], lightbox: ['ImageLightbox'], shopify: ['ShopifyProduct', 'ShopifyProductDescription', 'CmsButton'], 'shopify-checkout': ['ShopifyProduct', 'ShopifyProductDescription', 'ShopifyCart', 'CmsButton'], calendar: ['EventCalendar'], 'calendar-month': ['EventCalendar'], 'calendar-below': ['EventCalendar'], 'advanced-below': ['AdvancedSwiper'], 'parallax-below': ['SectionParallax'], 'youtube-light': ['Player'], list: ['ListStories'], video: ['Player'],
    }[route.split('/')[2]]
    const entrypoints = [...requested].map(file => /\/([A-Za-z]+)\.astro_astro_type_script/.exec(file)?.[1]).filter(Boolean)
    assert.deepEqual(entrypoints.filter(name => !['Document', 'Header', ...allowed].includes(name)), [], `${route}: unrelated component bootstrap`)
   }
   assert.deepEqual(errors, [], `${route}: browser exceptions`)
   const inlineScripts = await page.locator('script:not([src])').evaluateAll(nodes => nodes.filter(node => !node.type || node.type === 'module' || node.type === 'text/javascript').map(node => node.textContent || ''))
   const files = [...requested].sort().map(file => ({ file, bytes: chunks.get(file).bytes, gzipBytes: chunks.get(file).gzipBytes }))
   pages.push({ route, features, files, inlineScriptBytes: inlineScripts.reduce((total, text) => total + Buffer.byteLength(text), 0), jsBytes: files.reduce((total, file) => total + file.bytes, 0) + inlineScripts.reduce((total, text) => total + Buffer.byteLength(text), 0), gzipJsBytes: files.reduce((total, file) => total + file.gzipBytes, 0) + inlineScripts.reduce((total, text) => total + gzipSync(text).length, 0) })
   if (site === 'fixture' && route.includes('/calendar/')) assert(pages.at(-1).gzipJsBytes < 100 * 1024, 'Full calendar exceeded 100 KiB gzip')
   if (site === 'fixture' && route.includes('/calendar-month/')) assert(pages.at(-1).gzipJsBytes < 85 * 1024, 'Month calendar exceeded 85 KiB gzip')
   if (site === 'fixture' && route.includes('/tabs/')) assert(pages.at(-1).gzipJsBytes < 6 * 1024, 'Tabs page exceeded its 6 KiB gzip budget including shared scripts')
   if (site === 'fixture' && /\/(swiper|slider|lightbox)\//.test(route)) assert(pages.at(-1).gzipJsBytes < 9 * 1024, `${route}: native carousel exceeded 9 KiB gzip budget including shared scripts`)
   if (site === 'fixture' && /\/shopify(?:-checkout)?\//.test(route)) assert(pages.at(-1).gzipJsBytes < 11 * 1024, 'Shopify page exceeded 11 KiB gzip before checkout')
   if (site === 'fixture' && route.includes('/shopify-checkout/')) {
    const before = new Set(requested)
    await checkShopifyCheckout(page)
    const added = [...requested].filter(file => !before.has(file))
    const sdkModules = added.flatMap(file => chunks.get(file)?.modules || [])
    assert(sdkModules.some(id => /shopify-graphql-request/.test(id)), 'Checkout must load the real SDK dynamically')
    const gzipBytes = added.reduce((sum, file) => sum + chunks.get(file).gzipBytes, 0)
    assert(gzipBytes < 18 * 1024, 'Deferred checkout exceeded 18 KiB gzip')
    pages.at(-1).checkout = { files: added, gzipBytes, requests: 2, note: 'Mocked failed product checkout and successful cart retry; no real checkout created' }
    assert.deepEqual(errors, [], 'Checkout browser exceptions')
    await checkShopifyLoadFailure(context, origin, added)
   }
   if (site === 'fixture' && /(?:-below|youtube-light|calendar-month|list)\//.test(route)) {
    const initial = new Set(requested)
    const component = route.includes('calendar') ? '[data-lm-calendar]' : route.includes('advanced') ? '[data-lm-swiper]' : route.includes('parallax') ? '[data-lm-parallax]' : '[data-lm-player]'
    if (route.includes('-below')) {
     assert(pages.at(-1).gzipJsBytes < 9 * 1024, `${route}: deferred bootstrap exceeded 9 KiB`)
     await page.locator(component).scrollIntoViewIfNeeded()
     if (route.includes('parallax')) await page.waitForSelector('[data-lm-parallax="active"]')
     else await page.waitForSelector(`${component}[data-deferred-state="ready"]`)
    } else if (route.includes('youtube-light')) {
     await page.getByRole('button', { name: 'Load video' }).click()
     await page.waitForSelector('[data-player-ready="active"] youtube-video')
    } else if (route.includes('/list/')) {
     await page.route('**/api/story-list?*', handler => handler.fulfill({ contentType: 'application/json', body: JSON.stringify({ html: '<p>Next page</p>', count: 1, total: 2 }) }))
     await page.getByRole('button', { name: 'Go to page 2', exact: true }).click()
     await page.getByText('Next page', { exact: true }).waitFor()
    }
    const activeModules = [...requested].flatMap(file => chunks.get(file)?.modules || [])
    const activeHas = pattern => activeModules.some(id => pattern.test(id))
    if (route.includes('calendar-month')) {
     assert.equal(activeHas(/fullcalendar\/(?:timegrid|list)(?:\/|\.)/), false, 'Month calendar must not load week/day/agenda plugins')
     assert.equal(activeHas(/fullcalendar\/locales\/(?:de|it|es)/), false, 'French calendar must not load other locales')
    }
    if (route.includes('calendar-below')) assert(activeHas(/node_modules\/fullcalendar\//))
    if (route.includes('advanced-below')) assert(activeHas(/node_modules\/swiper\//))
    if (route.includes('parallax-below')) assert(activeHas(/node_modules\/parallax-controller\//))
    if (route.includes('youtube-light')) {
     assert(activeHas(/node_modules\/youtube-video-element\//))
     assert.equal(activeHas(/node_modules\/(?:@mux|hls-video|dash-video|vimeo-video)/), false, 'YouTube must not load unrelated providers')
    }
    if (route.includes('/list/')) assert.equal(activeHas(/storyblok-js-client|client\/storyListRender/), false, 'HTML endpoint lists must not load legacy client rendering')
    const added = [...requested].filter(file => !initial.has(file))
    pages.at(-1).activation = { files: added, gzipBytes: added.reduce((sum, file) => sum + chunks.get(file).gzipBytes, 0) }
    assert.deepEqual(errors, [], `${route}: activation errors`)
   }
   await context.close()
  }
  if (site === 'fixture') await checkDeferredLifecycle(browser, origin, chunks)
 } finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
 }
 const report = { site, note: 'Cold-page production JS requests, including transitive/dynamic requests during initialization. External services blocked. Gzip is computed, not a wire transfer measurement. Interaction/scroll-triggered later downloads are not exhaustive.', pages }
 fs.writeFileSync(path.join(reportDir, 'pages.json'), JSON.stringify(report, null, 2) + '\n')
 console.table(pages.map(({ route, jsBytes, gzipJsBytes, features }) => ({ route, jsBytes, gzipJsBytes, ...features })))
 console.log(`Report: ${path.join(reportDir, 'pages.json')}`)
}
main().catch(error => { console.error(error); process.exitCode = 1 })
