const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')
const { legacyTabsAssets } = require('./astro-legacy-tabs.cjs')
const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture')
const snapshot = page => page.evaluate(() => ({ selected: document.querySelector('[role=tab][aria-selected=true]')?.textContent.trim(), focused: document.activeElement?.getAttribute('role') === 'tab' ? document.activeElement.textContent.trim() : null, orientation: document.querySelector('[role=tablist]')?.getAttribute('aria-orientation') || 'horizontal', panels: [...document.querySelectorAll('[role=tabpanel]')].filter(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true').map(node => node.innerText.replace(/\s+/g, ' ').trim()) }))
async function selected(page, title) {
 await page.waitForFunction(title => document.querySelector('[role=tab][aria-selected=true]')?.textContent.trim() === title, title, { timeout: 10000 }).catch(async error => { console.error(page.url(), title, await snapshot(page)); await page.screenshot({ path: '/tmp/lumen-tabs-parity-failure.png' }); throw error })
 // React updates slideIndex in an effect; wait for that effect and the visible
 // panel, not just the tab's immediate aria-selected state, before the next input.
 await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
 await page.waitForFunction(title => {
  const panel = [...document.querySelectorAll('[role=tabpanel]')].find(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true')
  const viewport = panel?.closest('.swiper, .lm-tab-panels')
  return document.querySelector('[role=tab][aria-selected=true]')?.textContent.trim() === title && viewport && !viewport.swiper?.animating && Math.abs(panel.getBoundingClientRect().left - viewport.getBoundingClientRect().left) < 2
 }, title, { timeout: 10000 })
}
async function swipe(page, forward, touch = true) {
 await page.waitForFunction(() => {
  const panel = [...document.querySelectorAll('[role=tabpanel]')].find(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true')
  const viewport = panel?.closest('.swiper, .lm-tab-panels')
  return viewport && !viewport.swiper?.animating && Math.abs(panel.getBoundingClientRect().left - viewport.getBoundingClientRect().left) < 2
 })
 const panel = page.getByRole('tabpanel').first()
 const rect = await panel.boundingBox()
 const distance = Math.min(600, rect.width * .65), y = rect.y + Math.min(rect.height - 20, 90)
 const start = rect.x + (forward ? rect.width * .8 : rect.width * .2), end = start + (forward ? -distance : distance)
 if (touch) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] })
  for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start + (end - start) * i / 10, y }] }); await page.waitForTimeout(20) }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
 } else {
  await page.mouse.move(start, y); await page.mouse.down(); await page.mouse.move(end, y, { steps: 12 }); await page.mouse.up()
 }
 await page.waitForTimeout(650)
}
async function main() {
 const legacy = await legacyTabsAssets()
 const server = http.createServer(async (req, res) => {
  try {
   const url = new URL(req.url, 'http://localhost')
   if (url.pathname === '/legacy.js' || url.pathname === '/legacy.css') { res.setHeader('Content-Type', url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css'); res.end(url.pathname.endsWith('.js') ? legacy.js : legacy.css); return }
   if (url.pathname.startsWith('/legacy/')) { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/legacy.css"></head><body><main id="root" style="width:100%;max-width:900px;margin:auto;padding-top:80px"></main><script type="module" src="/legacy.js"></script></body></html>'); return }
   let file = path.resolve(root, '.' + url.pathname)
   if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return }
   if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
   res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html'); res.end(await fs.readFile(file))
  } catch { res.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 const origin = `http://127.0.0.1:${server.address().port}`
 let browser
 try {
  browser = await chromium.launch()
  const errors = [], observations = []
  for (const variant of (process.env.TABS_PARITY_VARIANT ? [process.env.TABS_PARITY_VARIANT] : ['horizontal', 'vertical'])) {
   const states = []
   for (const renderer of ['legacy', 'astro']) {
    console.log(`Checking ${renderer} ${variant}`)
    const context = await browser.newContext({ viewport: { width: 900, height: 900 }, hasTouch: true })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(`${renderer}: ${error.message}`))
    await page.goto(`${origin}/${renderer === 'legacy' ? 'legacy' : 'tab-parity'}/${variant}/`, { waitUntil: 'networkidle' })
    await selected(page, 'First')
    const sequence = [await snapshot(page)]
    await page.getByRole('tab', { name: 'Second', exact: true }).click(); await selected(page, 'Second')
    sequence.push(await snapshot(page))
    await page.waitForTimeout(650)
    const geometry = await page.getByRole('tabpanel').boundingBox()
    assert(Math.abs(geometry.height - 368) < 2, `${renderer} ${variant}: active panel padding/height`)
    assert(Math.abs(geometry.width - (variant === 'vertical' ? 675 : 900)) < 2, `${renderer}: CMS column widths`)
    await page.getByRole('tab', { name: 'Second', exact: true }).press('Home'); sequence.push(await snapshot(page))
    await page.keyboard.press('Enter'); await selected(page, 'First')
    await page.keyboard.press(variant === 'vertical' ? 'ArrowDown' : 'ArrowRight'); sequence.push(await snapshot(page))
    await page.keyboard.press('Space'); await selected(page, 'Second')
    await swipe(page, true); await selected(page, 'Third')
    await swipe(page, true); await selected(page, 'First')
    await swipe(page, false); await selected(page, 'Third')
    // Click a direct tab and drag with a mouse; controls must not need Swiper APIs.
    await page.getByRole('tab', { name: 'First', exact: true }).click(); await selected(page, 'First'); await page.waitForTimeout(600)
    await swipe(page, true, false); await selected(page, 'Second')
    await page.setViewportSize({ width: 375, height: 900 }); await page.waitForTimeout(200)
    const mobile = await snapshot(page)
    assert.equal(mobile.selected, 'Second'); assert.equal(mobile.orientation, 'horizontal')
    assert.equal(await page.getByRole('tabpanel').count(), 1)
    await page.getByRole('tab', { name: 'Second', exact: true }).press('End'); sequence.push(await snapshot(page))
    await page.keyboard.press('Enter'); await selected(page, 'Third')
    if (renderer === 'astro') {
     assert.equal(await page.locator('.lm-tab-panels.swiper').count(), 0)
     const inactive = await page.locator('[role=tabpanel][aria-hidden=true]').evaluateAll(nodes => nodes.every(node => node.inert && node.tabIndex === -1))
     assert(inactive, 'Inactive panels must be excluded from keyboard navigation')
     // Resizing content after images/forms load must update the carousel height.
     await page.getByRole('tabpanel').locator('[data-parity-content]').evaluate(node => { node.style.height = '500px' })
     await page.waitForFunction(() => document.querySelector('.lm-tab-panels').getBoundingClientRect().height >= 500)
     await page.emulateMedia({ reducedMotion: 'reduce' })
     assert.equal(await page.locator('.lm-tab-panels').evaluate(node => getComputedStyle(node).scrollBehavior), 'auto')
     await page.getByRole('tab', { name: 'First', exact: true }).click(); await selected(page, 'First')
     await page.getByRole('textbox', { name: 'First input' }).fill('editable input')
     assert.equal(await page.getByRole('textbox', { name: 'First input' }).inputValue(), 'editable input')
     // Repeat lifecycle mounting on retained DOM; no duplicate controllers.
     await page.evaluate(() => { document.dispatchEvent(new Event('astro:before-swap')); document.dispatchEvent(new Event('astro:page-load')); document.dispatchEvent(new Event('lumen:content-mounted')) })
     await page.getByRole('tab', { name: 'Second', exact: true }).click(); await selected(page, 'Second')
    }
    states.push(sequence)
    await context.close()
   }
   assert.deepEqual(states[1], states[0], `${variant}: keyboard/click/ARIA state differs from the Next.js renderer`)
   observations.push({ variant, parity: true, touchSwipe: true, wrapBothDirections: true, mouseDrag: true, responsiveSelection: true })
  }
  for (const variant of ['scrollable', 'single', 'empty']) {
   const page = await browser.newPage({ viewport: { width: 375, height: 900 } })
   page.on('pageerror', error => errors.push(error.message))
   await page.goto(`${origin}/tab-parity/${variant}/`, { waitUntil: 'networkidle' })
   if (variant === 'scrollable') {
    await page.getByRole('tab').first().focus(); await page.keyboard.press('End'); await page.keyboard.press('Enter')
    const bounds = await page.getByRole('tab', { selected: true }).evaluate(tab => { const a = tab.getBoundingClientRect(), b = tab.parentElement.getBoundingClientRect(); return { left: a.left - b.left, right: a.right - b.right } })
    assert(bounds.left >= -1 && bounds.right <= 1, 'Selected overflowing tab must be revealed')
   } else assert.equal(await page.getByRole('tab').count(), variant === 'single' ? 1 : 0)
   await page.close()
  }
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ nextjsRendererParity: observations, extraCases: ['overflow', 'empty', 'single', 'dynamic content height', 'reduced motion', 'inputs', 'remount'] }, null, 2))
 } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
