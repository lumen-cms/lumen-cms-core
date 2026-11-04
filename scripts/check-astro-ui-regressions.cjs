const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')

async function main() {
 const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture')
 const server = http.createServer(async (req, res) => {
  try {
   const pathname = new URL(req.url, 'http://localhost').pathname
   const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname))
   if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return }
   res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html')
   res.end(await fs.readFile(file))
  } catch { res.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 let browser
 try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('https://a.storyblok.com/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="teal"/></svg>' }))
  for (const width of [390, 1280]) {
   await page.setViewportSize({ width, height: 800 })
   await page.goto(`http://127.0.0.1:${server.address().port}/ui-regressions/asana/`)
   await page.waitForFunction(() => document.querySelector('#accordion details')?.dataset.accordionGroup)
   for (const alignment of ['left', 'center', 'right', 'justify', 'unset']) {
    const expected = alignment === 'unset' ? (width >= 900 ? 'center' : 'start') : alignment
    const actual = await page.locator(`#paragraph-align-${alignment} h2`).evaluate(el => getComputedStyle(el).textAlign)
    assert.equal(actual, expected, `Rich-text heading alignment ${alignment} at ${width}px`)
   }
   const language = page.getByRole('link', { name: 'Deutsch', exact: true })
   assert.equal(await language.evaluate(el => getComputedStyle(el).color), 'rgba(0, 0, 0, 0.87)')
   await page.getByRole('button', { name: 'Languages', exact: true }).click()
   const button = page.getByRole('link', { name: 'Primary text', exact: true })
   const color = await button.evaluate(el => getComputedStyle(el).color)
   await button.hover()
   await page.waitForTimeout(250)
   const hovered = await button.evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor }))
   assert.equal(hovered.color, color)
   assert.match(hovered.background, /(?:0\.04|4%)/)
   const grey = page.getByRole('link', { name: 'Unelevated', exact: true })
   assert.deepEqual(await grey.evaluate(el => { const s = getComputedStyle(el); return [s.backgroundColor, s.boxShadow] }), ['rgb(224, 224, 224)', 'none'])
   assert.equal(await page.locator('#buttons #mdi-laptop').count(), 1)
   assert.deepEqual(await page.locator('#testimonial .lm-flex-row .lm-flex-row').evaluate(el => { const s = getComputedStyle(el); return [s.alignItems, s.justifyContent] }), ['normal', 'normal'])
   const cardButton = page.getByRole('link', { name: 'Zur individuellen Anfrage', exact: true })
   assert.equal(await cardButton.isVisible(), true)
   assert.equal(await page.locator('#linked-card a').count(), 2)
   assert.equal(await cardButton.evaluate(el => el.parentElement.closest('a')), null)
   await cardButton.scrollIntoViewIfNeeded()
   assert(await cardButton.evaluate(el => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) }))
   assert.equal(await page.locator('#unlinked-card button').count(), 1)
   assert.equal(await page.locator('#course-card button').count(), 1)
   assert.equal(await page.locator('#course-card button[data-lm-action="courseAction"]').count(), 1)
   await page.emulateMedia({ reducedMotion: 'reduce' })
   for (const label of ['Above media', 'Get started', 'Continue course', 'Hover course']) {
    const decoration = page.locator('#course-card .lm-button').filter({ hasText: label })
    assert.equal(await decoration.evaluate(el => el.tagName), 'SPAN')
    await page.locator('#course-card').hover()
    await decoration.scrollIntoViewIfNeeded()
    const point = await decoration.evaluate(el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } })
    assert.equal(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'), point), '#destination')
    await page.mouse.click(point.x, point.y)
    await page.waitForURL('**/#destination')
    assert.equal(new URL(page.url()).hash, '#destination')
    await page.evaluate(() => history.replaceState(null, '', location.pathname))
   }
   await page.emulateMedia({ reducedMotion: 'no-preference' })
   assert.equal(await page.locator('#image-cards .lm-card-content').count(), 0)
   const ratio = await page.locator('#image-cards .lm-card').evaluate(el => { const r = el.getBoundingClientRect(); return r.width / r.height })
   assert(Math.abs(ratio - 4 / 3) < .01, `Image-only card ratio: ${ratio}`)
   for (const selector of ['#image-cards .lm-card-link', '#linked-card .lm-card-cover-link']) {
    const action = page.locator(selector)
    await action.hover({ position: { x: 8, y: 8 } }); await page.waitForTimeout(200)
    assert.equal(await action.evaluate(el => getComputedStyle(el, '::after').opacity), '0.04')
    await page.mouse.down()
    await page.waitForTimeout(200)
    assert.equal(await action.evaluate(el => getComputedStyle(el, '::after').opacity), '0.16')
    await page.mouse.move(0, 0); await page.mouse.up()
   }
   const first = page.locator('#accordion details').nth(0)
   const second = page.locator('#accordion details').nth(1)
   await first.locator('summary').click()
   await page.waitForTimeout(300)
   assert(await first.evaluate(el => el.open))
   await second.locator('summary').click()
   await page.waitForTimeout(80)
   assert(await first.evaluate(el => el.open && el.getAnimations().length > 0), 'Closing content must stay mounted during animation')
   await page.waitForTimeout(250)
   assert.equal(await first.evaluate(el => el.open), false)
   assert(await second.evaluate(el => el.open))
   assert.equal(await page.locator('#legacy-slider [data-carousel-pause]').count(), 0)
   await page.locator('#scroll-link').click()
   await page.waitForTimeout(80)
   const during = await page.evaluate(() => scrollY)
   await page.waitForTimeout(1000)
   const after = await page.evaluate(() => scrollY)
   assert(after > during + 100, 'Anchor navigation must animate')
   const frame = page.locator('.lm-background-image-frame')
   assert.equal(await frame.evaluate(el => getComputedStyle(el).position), width >= 600 ? 'fixed' : 'absolute')
   if (width >= 600) {
    assert.equal(await frame.evaluate(el => el.getBoundingClientRect().top), 0)
    await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }))
    assert.equal(await frame.evaluate(el => el.getBoundingClientRect().top), 0)
   }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto')
  await page.locator('#accordion summary').first().click()
  assert.equal(await page.locator('#accordion details').first().evaluate(el => el.getAnimations().length), 0)
  assert.deepEqual(errors, [])
  console.log('Asana UI regressions: desktop, mobile and reduced-motion checks passed')
 } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
