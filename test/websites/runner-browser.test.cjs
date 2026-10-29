const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const http = require('node:http')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const exec = promisify(execFile)
const root = path.resolve(__dirname, '../..')

test('carousel capture normalization removes only sub-millipixel rounding', async (t) => {
  const { chromium } = require('playwright')
  const {
    stabilizeCarouselTransforms
  } = require('../../scripts/website-dynamics.cjs')
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const page = await browser.newPage()
  await page.setContent(`<style>body{margin:0}</style>
    <div class="slider-container"><div class="slider-list"
      style="width:10800px;transform:translateX(-3599.9995px)">Legacy text</div></div>
    <div class="slider-container"><div class="slider-list fractional" style="transform:translateX(0.25px)">Fractional layout</div></div>`)
  const normalized = await page.evaluate(stabilizeCarouselTransforms)
  assert.equal(normalized.length, 1)
  assert(Math.abs(normalized[0].dx) > 0 && Math.abs(normalized[0].dx) <= 0.001)
  assert.equal(
    await page
      .locator('.slider-list')
      .first()
      .evaluate((el) => el.getBoundingClientRect().x),
    -3600
  )
  assert.equal(
    await page
      .locator('.fractional')
      .evaluate((el) => el.getBoundingClientRect().x),
    0.25
  )
})

test('browser dynamic classification excludes only reviewed widgets and preserves body carousels', async (t) => {
  const { chromium } = require('playwright')
  const {
    collectReviewedRegions
  } = require('../../scripts/website-dynamics.cjs')
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
  await page.route('**/*', (route) => route.abort())
  await page.setContent(`<style>body{margin:0}.lm-carousel{height:80px}
    .woot-widget-bubble{position:fixed;right:20px;bottom:20px;width:64px;height:64px}
    video{width:200px;height:100px}</style>
    <main><div><div class="lm-carousel"><div class="swiper-slide"><p>Announcement</p></div></div></div>
    <section><div class="lm-carousel"><div class="swiper-slide">Body content</div></div></section></main>
    <video autoplay muted loop src="https://example.test/animation.mp4"></video>
    <video src="https://example.test/manual.mp4"></video>
    <button class="woot-widget-bubble">Chat</button>`)
  const regions = await page.evaluate(collectReviewedRegions, {
    site: 'upskill'
  })
  assert.deepEqual(
    regions.map((r) => r.kind),
    ['rotating-announcement', 'autoplay-video', 'external-chat']
  )
  assert(regions[0].signature.includes('Announcement'))
  assert(!regions[0].signature.includes('Body content'))
  assert.equal(regions[2].rect.height, 112) // Includes the known bubble shadow.
  await page
    .locator('main > div > .lm-carousel')
    .evaluate((el) => (el.style.height = '250px'))
  assert.equal(
    (await page.evaluate(collectReviewedRegions, { site: 'upskill' })).filter(
      (r) => r.kind === 'rotating-announcement'
    ).length,
    0
  )
})

test('browser runner returns zero for matching pages and nonzero with an HTML report for differences', async (t) => {
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'website-browser-'))
  let changed = false,
    requests = 0
  const server = http.createServer((req, res) => {
    if (req.url !== '/') {
      res.writeHead(404)
      return res.end()
    }
    const color = changed && requests++ % 2 ? 'black' : 'white'
    res.setHeader('Content-Type', 'text/html')
    res.end(
      `<html><head><title>Fixture</title><style>body{background:${color};margin:0}</style></head><body><h1>Fixture</h1><script>window.next={router:{isReady:true}}</script></body></html>`
    )
  })
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve))
    await fs.rm(output, { recursive: true, force: true })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const inventory = path.join(output, 'inventory.json')
  await fs.writeFile(
    inventory,
    JSON.stringify({
      routes: [
        {
          id: 'fixture',
          site: 'fixture',
          path: '/',
          locale: 'en',
          local: origin,
          live: origin
        }
      ]
    })
  )
  const run = (directory) =>
    exec(
      process.execPath,
      [
        'scripts/visual-site-audit.cjs',
        '--inventory',
        inventory,
        '--output',
        directory,
        '--candidate',
        'fixture',
        '--tooling',
        root,
        '--local-origin',
        origin,
        '--widths',
        '375',
        '--workers',
        '1',
        '--settle-ms',
        '0',
        '--strict',
        '--run'
      ],
      { cwd: root, timeout: 60000 }
    )
  await run(path.join(output, 'matching'))
  const matching = JSON.parse(
    await fs.readFile(path.join(output, 'matching/summary.json'))
  )
  assert.equal(matching.passed, 1)
  changed = true
  await assert.rejects(
    run(path.join(output, 'different')),
    (error) => error.code === 1
  )
  const different = JSON.parse(
    await fs.readFile(path.join(output, 'different/summary.json'))
  )
  assert.equal(different.failed, 1)
  assert(different.results[0].changedPercent > 50)
  await fs.access(path.join(output, 'different/report.html'))
  await fs.access(path.join(output, 'different/fixture-375-diff.png'))
})
