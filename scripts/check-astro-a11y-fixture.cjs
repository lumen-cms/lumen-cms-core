const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')
async function main() {
 const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture')
 const server = http.createServer(async (req, res) => {
  try {
   const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname)
   if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return }
   res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html')
   res.end(await fs.readFile(file))
  } catch { res.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 const origin = `http://127.0.0.1:${server.address().port}`
 const browser = await chromium.launch()
 try {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort())
  await page.goto(origin + '/__fixture/index.html')
  await page.waitForFunction(() => document.querySelector('[data-lm-parallax]')?.dataset.lmParallax === 'static')
  assert(await page.locator('a.lm-rich-link').first().evaluate(link => getComputedStyle(link).textDecorationLine.includes('underline')), 'Text links must be recognizable without relying on color')
  assert(await page.locator('[data-lm-motion]').count())
  assert.deepEqual(await page.locator('[data-lm-motion]').evaluateAll(nodes => nodes.map(n => n.dataset.motionState).filter(s => s !== 'complete')), [])
  assert.deepEqual(await page.locator('[data-lm-countup]').evaluateAll(nodes => nodes.filter(n => !n.textContent.includes(n.dataset.end)).map(n => n.textContent)), [])
  assert.deepEqual(await page.locator('[data-parallax-layer] > img').evaluateAll(nodes => nodes.map(n => n.alt).filter(Boolean)), [])
  assert.deepEqual(await page.locator('[data-lm-tabs] .swiper').evaluateAll(nodes => nodes.map(n => n.swiper.params.speed).filter(Boolean)), [])
  const rotation = page.locator('[data-carousel-pause]').first()
  assert.equal(await rotation.textContent(), 'Start slideshow')
  await rotation.click()
  assert.equal(await rotation.textContent(), 'Pause slideshow')
  assert(await rotation.evaluate(button => {
   const root = button.closest('.lm-swiper, .lm-shopify-product')
   const native = root.querySelector('[data-lm-native-carousel]')
   if (native) return JSON.parse(native.dataset.lmNativeCarousel).autoplay.delay > 0 && getComputedStyle(native).scrollBehavior === 'auto'
   const swiper = root.querySelector('.swiper').swiper
   return typeof swiper.params.autoplay === 'object' && swiper.params.autoplay.delay > 0 && swiper.params.speed === 0
  }), 'Explicit playback must preserve the configured delay with reduced motion')
  await rotation.click()
  // Focus entering slide content must stop rotation even without reduced motion.
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  const pause = page.locator('[data-carousel-pause]').first()
  await pause.click()
  assert.equal(await pause.textContent(), 'Start slideshow')
  await pause.click()
  assert.equal(await pause.textContent(), 'Pause slideshow')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() => [...document.querySelectorAll('[data-carousel-pause]')].every(n => n.textContent === 'Start slideshow'))
  assert.deepEqual(await page.locator('[data-lm-parallax]').evaluateAll(nodes => nodes.map(n => n.dataset.lmParallax).filter(s => s !== 'static')), [])
  await page.close()
  const noJS = await browser.newPage({ javaScriptEnabled: false })
  await noJS.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort())
  await noJS.goto(origin + '/__fixture/index.html')
  assert.deepEqual(await noJS.locator('.lm-motion__transition').evaluateAll(nodes => nodes.filter(n => getComputedStyle(n).visibility === 'hidden' || n.getBoundingClientRect().height === 0).map(n => n.outerHTML)), [])
  const details = noJS.locator('details.lm-accordion-item').first()
  await details.locator(':scope > summary').focus()
  await noJS.keyboard.press('Enter')
  assert.equal(await details.evaluate(n => n.open), true)
  console.log('Reduced-motion, live preference changes, autoplay controls, no-JS motion and native accordion keyboard checks passed.')
 } finally { await browser.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
