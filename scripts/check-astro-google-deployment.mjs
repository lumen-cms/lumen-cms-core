import { chromium } from 'playwright'

// Observe real page views only. Do not send synthetic conversions to live properties.
const sites = process.argv.slice(2)
if (!sites.length) throw new Error('Pass one or more deployed website URLs')
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
 for (const site of sites) {
  const context = await browser.newContext()
  const page = await context.newPage()
  const hits = [], errors = []
  let workers = 0
  page.on('worker', () => workers++)
  page.on('pageerror', error => errors.push(error.message))
  context.on('response', response => {
   const url = new URL(response.url())
   if (!(url.hostname === 'analytics.google.com' || url.hostname === 'google-analytics.com' || url.hostname.endsWith('.google-analytics.com')) || !url.pathname.endsWith('/collect')) return
   for (const line of (response.request().postData() || '').split('\n')) {
    const params = new URLSearchParams(url.search)
    for (const [key, value] of new URLSearchParams(line)) params.set(key, value)
    hits.push({ host: url.hostname, status: response.status(), event: params.get('en'), id: params.get('tid') })
   }
  })
  try {
   await page.goto(site, { waitUntil: 'load', timeout: 60000 })
   const library = page.locator('#gtag-library')
   const source = await library.count() ? await library.getAttribute('src') : null
   const expectedId = source ? new URL(source).searchParams.get('id') : null
   await page.waitForTimeout(expectedId ? 15000 : 2000)
   const scripts = await page.locator('#gtag-init,#gtag-library').evaluateAll(nodes => nodes.map(node => ({ id: node.id, type: node.type, explicitPageView: node.id === 'gtag-init' && node.textContent.includes('send_page_view:false') })))
   const views = hits.filter(hit => hit.event === 'page_view' && hit.status >= 200 && hit.status < 300)
   const counts = Object.fromEntries([...new Set(views.map(hit => hit.id))].map(id => [id, views.filter(hit => hit.id === id).length]))
   const passed = expectedId ? workers > 0 && scripts.every(script => script.type === 'text/partytown-x') && counts[expectedId] === 1 && Object.values(counts).every(count => count === 1) : hits.length === 0
   console.log(JSON.stringify({ site, expectedId, workers, scripts, pageViews: views, counts, errors, passed }))
   if (!passed || errors.length) process.exitCode = 1
  } catch (error) {
   console.log(JSON.stringify({ site, passed: false, error: error.message }))
   process.exitCode = 1
  } finally { await context.close() }
 }
} finally { await browser.close() }
