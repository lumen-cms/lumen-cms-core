// Local-only live/consumer comparison. Dry-run is the default; --run launches
// Playwright. No forms are submitted, artifacts uploaded, or baselines accepted.
const fs = require('node:fs/promises')
const path = require('node:path')
const { createRequire } = require('node:module')
const { parseArgs } = require('node:util')

const { values } = parseArgs({
  options: {
    inventory: { type: 'string' },
    output: { type: 'string' },
    tooling: { type: 'string' },
    candidate: { type: 'string' },
    widths: { type: 'string', default: '1280,375' },
    workers: { type: 'string', default: '2' },
    'settle-ms': { type: 'string', default: '80' },
    'freeze-swipers': { type: 'boolean', default: false },
    limit: { type: 'string' },
    strict: { type: 'boolean', default: false },
    'local-origin': { type: 'string' },
    'max-diff-percent': { type: 'string', default: '0' },
    run: { type: 'boolean', default: false }
  }
})
const allowed = new Set([
  'https://baliinternships.com',
  'https://planet.training',
  'https://upskill.study',
  'http://127.0.0.1:3020',
  'http://127.0.0.1:3021',
  'http://127.0.0.1:3022',
  'http://127.0.0.1:3030',
  'http://127.0.0.1:3031',
  'http://127.0.0.1:3032',
  'http://127.0.0.1:3040',
  'http://127.0.0.1:3041',
  'http://127.0.0.1:3042',
  'http://127.0.0.1:3050',
  'http://127.0.0.1:3051',
  'http://127.0.0.1:3052',
  'http://127.0.0.1:3060',
  'http://127.0.0.1:3061',
  'http://127.0.0.1:3062'
])
if (values['local-origin']) {
  const url = new URL(values['local-origin'])
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash)
    throw new Error('--local-origin must be a loopback HTTP origin')
  allowed.add(url.origin)
}
const safeUrl = (input) => {
  const url = new URL(input)
  if (!allowed.has(url.origin) || url.username || url.password || url.search) {
    throw new Error('Inventory URL outside the approved comparison sites')
  }
  return url.toString()
}
const scrub = (text) =>
  String(text).replace(/https?:\/\/[^\s)"']+/g, (url) => {
    try {
      const parsed = new URL(url)
      return parsed.origin + parsed.pathname
    } catch {
      return '[URL]'
    }
  })

async function main() {
  if (!values.inventory || !values.output || !values.candidate) {
    throw new Error('Provide --inventory, --output and --candidate; add --run to execute')
  }
  const widths = values.widths.split(',').map(Number)
  const workers = Number(values.workers)
  const settleMs = Number(values['settle-ms'])
  const limit = values.limit ? Number(values.limit) : Infinity
  const maxDiffPercent = Number(values['max-diff-percent'])
  if (
    widths.some((w) => !Number.isInteger(w) || w < 320 || w > 1920) ||
    !Number.isInteger(workers) || workers < 1 || workers > 3 ||
    !Number.isInteger(settleMs) || settleMs < 0 || settleMs > 1000 ||
    !(limit > 0) || !Number.isFinite(maxDiffPercent) || maxDiffPercent < 0 || maxDiffPercent > 100
  ) throw new Error('Invalid width, worker count (1–3), or limit')
  const inventory = JSON.parse(await fs.readFile(values.inventory, 'utf8'))
  const output = path.resolve(values.output)
  try {
    const existing = JSON.parse(await fs.readFile(path.join(output, 'run.json'), 'utf8'))
    if (existing.candidate !== values.candidate) {
      throw new Error('Use a separate output directory for each candidate to preserve prior evidence')
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const cases = inventory.routes.flatMap((row) => {
    const local = safeUrl(row.local)
    const live = safeUrl(row.live)
    if (!/^[a-z0-9-]+$/.test(row.id)) throw new Error('Invalid route identifier')
    return widths.filter((width) => !row.previousWidths?.includes(width))
      .map((width) => ({ ...row, local, live, width, key: `${row.id}-${width}` }))
  })
  let previous = []
  try {
    previous = (await fs.readFile(path.join(output, 'results.jsonl'), 'utf8'))
      .trim().split('\n').filter(Boolean).map(JSON.parse)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const completed = new Set(previous.filter((r) =>
    r.candidate === values.candidate && r.status !== 'failed'
  ).map((r) => r.key))
  const queue = cases.filter((c) => !completed.has(c.key)).slice(0, limit)
  if (values.strict && (!cases.length || previous.length))
    throw new Error('Strict runs require a nonempty inventory and a fresh output directory')
  console.log(JSON.stringify({ mode: values.run ? 'run' : 'dry-run', cases: cases.length,
    resumed: completed.size, queued: queue.length, workers, widths, settleMs, output }))
  if (!values.run) return
  if (!values.tooling) throw new Error('Provide an isolated --tooling directory containing playwright')
  const toolingRequire = createRequire(path.resolve(values.tooling, 'package.json'))
  const { chromium } = toolingRequire('playwright')
  const sharp = require('sharp')
  await fs.mkdir(output, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const run = {
    startedAt: new Date().toISOString(), candidate: values.candidate,
    site: inventory.routes[0]?.site,
    browser: browser.version(), widths, workers, settleMs, totalCases: cases.length,
    freezeSwipers: values['freeze-swipers'],
    maxDiffPercent,
    policy: 'Raw images retained. Different pixels require review; never auto-accept.'
  }
  await fs.writeFile(path.join(output, 'run.json'), JSON.stringify(run, null, 2))

  async function capture(row, side) {
    const context = await browser.newContext({
      viewport: { width: row.width, height: row.width === 375 ? 812 : 720 },
      deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Makassar',
      reducedMotion: 'reduce'
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(scrub(error.message)))
    // Do not follow a top-level redirect out of the three reference sites.
    await page.route('**/*', (route) => {
      const request = route.request()
      if (request.isNavigationRequest() && request.frame() === page.mainFrame() &&
          (values.strict ? new URL(request.url()).origin !== new URL(row[side]).origin
            : !allowed.has(new URL(request.url()).origin))) return route.abort()
      return route.continue()
    })
    const started = Date.now()
    try {
      const response = await page.goto(row[side], { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.locator('body').waitFor()
      await page.waitForFunction(() => window.next?.router?.isReady === true,
        null, { timeout: 15000 })
      await page.keyboard.press('Escape')
      await page.evaluate(async () => {
        await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 8000))])
        for (const image of document.images) image.loading = 'eager'
      })
      const dismiss = async () => {
        const close = page.getByRole('button', { name: 'close', exact: true })
        if (await close.count() === 1 && await close.isVisible()) {
          try {
            await close.click({ timeout: 2000 })
          } catch (error) {
            // Promotions may close themselves during Playwright's actionability
            // check. Retry only if a visible dialog still needs dismissal.
            if (await close.isVisible()) throw error
          }
          await close.waitFor({ state: 'hidden', timeout: 3000 })
          return true
        }
        const dialog = page.getByRole('dialog').last()
        if (await dialog.count() && await dialog.isVisible()) {
          await page.keyboard.press('Escape')
          await page.waitForTimeout(300)
          return !await dialog.isVisible()
        }
        return false
      }
      await dismiss()
      // Visit overlapping viewports to trigger CMS intersection-observer images.
      // A bounded scrolling pass avoids an infinite third-party feed.
      for (let y = 0, step = 0; step < 250; step++) {
        const size = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, viewport: innerHeight }))
        if (y >= size.height) break
        await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
        await page.waitForTimeout(settleMs)
        y += Math.floor(size.viewport * 0.8)
      }
      await dismiss()
      await page.evaluate(async () => {
        await Promise.race([
          Promise.all([...document.images].map((image) => image.decode().catch(() => {}))),
          new Promise((resolve) => setTimeout(resolve, 30000))
        ])
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      // A loaded document can still contain an iframe/video placeholder.
      // Give that content a bounded settling period and retain any unresolved
      // placeholders in the metadata rather than concealing them in screenshots.
      await page.waitForFunction(() => ![...document.querySelectorAll('.MuiSkeleton-root')]
        .some((e) => e.getBoundingClientRect().width > 0), null, { timeout: 15000 }).catch(() => {})
      await page.evaluate(async () => {
        await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 8000))])
      })
      // Settle layout rather than relying on networkidle (chat can keep it busy).
      let last = -1
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(150)
        const height = await page.evaluate(() => document.documentElement.scrollHeight)
        if (height === last) break
        last = height
      }
      await dismiss()
      if (values['freeze-swipers']) {
        // Compare the same CMS items, not whichever autoplay frame was captured.
        await page.evaluate(() => {
          for (const el of document.querySelectorAll('.swiper')) {
            el.swiper?.autoplay?.stop()
            if (el.swiper?.params?.loop) el.swiper.slideToLoop(0, 0)
            else el.swiper?.slideTo(0, 0)
          }
        })
        await page.waitForTimeout(350)
      }
      // Lazy chunks can insert new assets after the first scrolling pass. Wait
      // for all rendered images, including newly inserted ones, before capture.
      await page.waitForFunction(() => [...document.images].every((e) =>
        e.complete || !e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) ||
        !e.getBoundingClientRect().width || !e.getBoundingClientRect().height ||
        e.getBoundingClientRect().right <= 0 || e.getBoundingClientRect().left >= innerWidth
      ), null, { timeout: 30000 }).catch(() => {})
      await page.evaluate(async () => {
        await document.fonts.ready
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      })
      await page.mouse.move(row.width - 1, 0)
      const transformNormalizations = values['freeze-swipers']
        ? await page.evaluate(require('./website-dynamics.cjs').stabilizeCarouselTransforms)
        : []
      const metrics = await page.evaluate(() => ({
        url: location.origin + location.pathname, title: document.title,
        height: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth - innerWidth,
        fontStatus: document.fonts.status,
        fontFaces: [...document.fonts].map((f) => ({ family: f.family, status: f.status })),
        dynamicRegions: [...document.querySelectorAll('iframe, video, .MuiSkeleton-root, .slider-container, .slider, .swiper')]
          .filter((e) => e.getBoundingClientRect().width > 0 &&
            getComputedStyle(e).visibility !== 'hidden' && !e.closest('.woot--hide'))
          .map((e) => { const r = e.getBoundingClientRect()
            return { tag: e.tagName, className: e.className,
              source: e.tagName === 'IFRAME' ? e.src.split('?')[0]
                : e.classList.contains('MuiSkeleton-root')
                  ? e.parentElement.querySelector('iframe')?.src.split('?')[0] : undefined,
              x: r.x, y: r.y + scrollY, width: r.width, height: r.height } }),
        accordionTitles: [...document.querySelectorAll('.MuiAccordionSummary-content')]
          .map((e) => { const r = e.getBoundingClientRect()
            return { text: e.textContent.trim(), align: getComputedStyle(e).textAlign,
              x: r.x, y: r.y + scrollY, width: r.width, height: r.height } }),
        headings: [...document.querySelectorAll('h1,h2,h3,h4')]
          .filter((e) => e.getBoundingClientRect().width > 0)
          .map((e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e)
            return { text: e.textContent.trim(), level: e.tagName, x: r.x, y: r.y + scrollY,
              width: r.width, height: r.height, font: s.fontSize,
              fontFamily: s.fontFamily, lineHeight: s.lineHeight, color: s.color } }),
        brokenImages: [...document.images]
          .filter((e) => e.complete && e.naturalWidth === 0 && e.getBoundingClientRect().width > 0)
          .map((e) => ({ alt: e.alt, src: e.currentSrc.split('?')[0] })),
        pendingImages: [...document.images].filter((e) => !e.complete &&
          e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
          e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0 &&
          e.getBoundingClientRect().right > 0 && e.getBoundingClientRect().left < innerWidth)
          .map((e) => ({ alt: e.alt, src: e.currentSrc.split('?')[0] })),
        links: [...document.querySelectorAll('a[href]')]
          .map((e) => ({ text: e.textContent.trim(), href: e.href.split('?')[0] }))
      }))
      metrics.expectedSearchRegions = await page.evaluate(
        require('./website-expected-changes.cjs').collectSearchRegions
      )
      metrics.reviewedRegions = await page.evaluate(
        require('./website-dynamics.cjs').collectReviewedRegions, { site: row.site }
      )
      metrics.transformNormalizations = transformNormalizations
      const file = `${row.key}-${side}.png`
      await page.screenshot({ path: path.join(output, file), fullPage: true,
        animations: 'disabled', caret: 'hide', timeout: 30000 })
      // A delayed promotion can open during capture. Close it through its UI,
      // then replace that capture; never remove the dialog with injected CSS.
      if (await dismiss()) {
        await page.screenshot({ path: path.join(output, file), fullPage: true,
          animations: 'disabled', caret: 'hide', timeout: 30000 })
      }
      return { side, file, status: response?.status(), capturedAt: new Date().toISOString(),
        durationMs: Date.now() - started, errors, ...metrics }
    } finally { await context.close() }
  }

  async function compare(row) {
    const pair = await Promise.allSettled([capture(row, 'local'), capture(row, 'live')])
    const captures = pair.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    await fs.writeFile(path.join(output, `${row.key}.json`), JSON.stringify({ row,
      candidate: values.candidate, captures }, null, 2))
    if (captures.length !== 2) return { status: 'failed', errors: pair
      .filter((r) => r.status === 'rejected').map((r) => scrub(r.reason?.message)) }
    const [local, live] = captures
    if (values.strict) return require('./website-results.cjs')
      .compareCaptures(local, live, output, row.key, maxDiffPercent)
    const [a, b] = await Promise.all(captures.map((c) => sharp(path.join(output, c.file))
      .removeAlpha().raw().toBuffer({ resolveWithObject: true })))
    const same = a.info.width === b.info.width && a.info.height === b.info.height
    let total = 0, changed = 0, max = 0
    const rows = {}
    if (same) for (let i = 0; i < a.data.length; i += 3) {
      let pixel = 0
      for (let c = 0; c < 3; c++) {
        const delta = Math.abs(a.data[i + c] - b.data[i + c])
        total += delta
        pixel = Math.max(pixel, delta)
      }
      max = Math.max(max, pixel)
      if (pixel > 16) {
        changed++
        const band = Math.floor(i / 3 / a.info.width / 200) * 200
        rows[band] = (rows[band] || 0) + 1
      }
    }
    const status = local.status !== live.status ? 'http-status-mismatch'
      : local.status >= 400 ? 'matching-http-error'
        : !same ? 'geometry-difference' : total === 0 ? 'pixel-identical' : 'review'
    return { status,
      heights: [local.height, live.height], httpStatus: [local.status, live.status],
      overflow: [local.overflow, live.overflow], errorCounts: [local.errors.length, live.errors.length],
      mae: same ? total / a.data.length : null,
      changedPercent: same ? changed / (a.data.length / 3) * 100 : null,
      maxChannelDifference: max, differenceBands: rows }
  }
  let cursor = 0, finished = 0
  const results = []
  try {
    await Promise.all(Array.from({ length: workers }, async () => {
      while (cursor < queue.length) {
        const row = queue[cursor++]
        let result
        try { result = await compare(row) }
        catch (error) { result = { status: 'failed', errors: [scrub(error.message)] } }
        const entry = { key: row.key, site: row.site, path: row.path, locale: row.locale,
          width: row.width, candidate: values.candidate, completedAt: new Date().toISOString(), ...result }
        await fs.appendFile(path.join(output, 'results.jsonl'), JSON.stringify(entry) + '\n')
        results.push(entry)
        finished++
        if (values.strict) console.log(
          `[${finished}/${queue.length}] ${entry.status.toUpperCase()} ${row.path} (${row.width}px)` +
          (entry.reasons?.length ? ` — ${entry.reasons.join('; ')}` : '') +
          (entry.errors?.length ? ` — ${entry.errors.join('; ')}` : '')
        )
        else console.log(JSON.stringify({ completed: finished, queued: queue.length, ...entry }))
      }
    }))
  } finally { await browser.close() }
  if (values.strict) {
    const summary = await require('./website-results.cjs').writeReport(output, results, run)
    console.log(`Report: ${path.join(output, 'report.html')}`)
    console.log(`${summary.passed} exact passes; ${summary.dynamicOnly} dynamic-only; ${summary.failed} failures`)
    if (summary.failed || results.length !== cases.length) process.exitCode = 1
  }
}
main().catch((error) => { console.error(scrub(error.message)); process.exitCode = 1 })
