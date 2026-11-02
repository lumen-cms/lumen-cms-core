// Production comparison; start the prepared apps on 3217 (Pages) and 3218 (App).
// node scripts/measure-app-router-pilot.cjs [--runs=5] [--visual-only]
const fs = require('node:fs/promises')
const path = require('node:path')
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const { gzipSync, brotliCompressSync } = require('node:zlib')
const { chromium } = require('playwright')
const sharp = require('sharp')

const repo = path.resolve(__dirname, '..')
const work = path.join(repo, '.next-reference/app-router-pilot')
const out = path.join(work, 'results')
const origins = { pages: 'http://127.0.0.1:3217', app: 'http://127.0.0.1:3218' }
const routes = ['/privacy-policy', '/de/datenschutzerklaerung']
const profiles = [
  {
    name: 'desktop',
    width: 1280,
    height: 900,
    cpu: 1,
    latency: 20,
    throughput: 1250000
  },
  {
    name: 'mobile',
    width: 375,
    height: 812,
    cpu: 4,
    latency: 150,
    throughput: 200000
  }
]
const runs = Number(
  process.argv.find((arg) => arg.startsWith('--runs='))?.split('=')[1] || 5
)
const visualOnly = process.argv.includes('--visual-only')
const size = (value) => ({
  raw: Buffer.byteLength(value),
  gzip: gzipSync(value).length,
  brotli: brotliCompressSync(value).length
})
const hash = (value) => createHash('sha256').update(value).digest('hex')
const report = {
  measuredAt: new Date().toISOString(),
  nextVersion: require('next/package.json').version,
  method:
    'Same published CMS snapshots, same core source, production Turbopack builds. Auth0 remains in both apps. Fresh browser contexts, disabled browser cache and shared-link prefetch. The existing toolbar logo retains its own prefetch behavior; out-of-pilot home prefetches return 404 and are recorded. External scripts/iframe documents are stubbed identically; external image/font/style responses are recorded once and replayed. CDP network/CPU throttling, alternating engine order. LCP/FCP/long tasks are lab observations, not field Web Vitals. JavaScript bytes include local chunks requested through six seconds after hydration, before test interactions; each file compressed independently.',
  profiles,
  runs,
  artifactSizes: [],
  visual: [],
  samples: [],
  staticContract: {},
  noJavaScript: [],
  externalAssetFailures: []
}

async function save() {
  await fs.writeFile(
    path.join(out, 'report.json'),
    JSON.stringify(report, null, 2) + '\n'
  )
}
async function localJsSize(mode, urls) {
  const files = [
    ...new Set(
      urls
        .map((url) => new URL(url).pathname)
        .filter((p) => p.startsWith('/_next/') && p.endsWith('.js'))
    )
  ]
  const total = { raw: 0, gzip: 0, brotli: 0 }
  for (const file of files) {
    const bytes = size(
      await fs.readFile(
        path.join(work, mode, '.next', file.slice('/_next/'.length))
      )
    )
    for (const key of Object.keys(total)) total[key] += bytes[key]
  }
  return { files: files.length, bytes: total }
}

// Only public asset bodies/content types are recorded. No response cookies or
// authorization headers are persisted. The benchmark never sends analytics.
async function installAssets(context, origin) {
  await context.route('**/*', async (route) => {
    const request = route.request()
    const url = request.url()
    if (url.startsWith(origin) || url.startsWith('data:'))
      return route.continue()
    if (
      new URL(url).hostname.endsWith('facebook.com') &&
      new URL(url).pathname === '/tr'
    )
      return route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
      })
    const kind = request.resourceType()
    if (kind === 'script')
      return route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: new URL(url).pathname.endsWith('/packs/js/sdk.js')
          ? 'window.chatwootSDK={run(){}}'
          : ''
      })
    if (kind === 'document')
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body style="margin:0;background:#fff"></body></html>'
      })
    // react-inlinesvg loads real SVG assets with fetch/XHR, not an image request.
    const svgAsset = new URL(url).pathname.endsWith('.svg')
    if (!['image', 'font', 'stylesheet'].includes(kind) && !svgAsset)
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}'
      })
    const file = path.join(out, 'assets', hash(url))
    let response
    try {
      response = JSON.parse(await fs.readFile(file, 'utf8'))
    } catch {
      try {
        const fetched = await route.fetch({ timeout: 20000 })
        response = {
          status: fetched.status(),
          contentType:
            fetched.headers()['content-type'] || 'application/octet-stream',
          body: (await fetched.body()).toString('base64')
        }
        await fs.writeFile(file, JSON.stringify(response))
      } catch (error) {
        report.externalAssetFailures.push({
          host: new URL(url).host,
          kind,
          error: error.message.split('\n')[0]
        })
        return route.abort()
      }
    }
    return route.fulfill({
      status: response.status,
      contentType: response.contentType,
      body: Buffer.from(response.body, 'base64')
    })
  })
}

async function setup(browser, mode, profile, throttled) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  })
  await installAssets(context, origins[mode])
  await context.addInitScript(() => {
    window.__pilot = { lcp: [], longtasks: [] }
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__pilot.lcp.push({
          time: entry.startTime,
          size: entry.size,
          element: entry.element?.tagName
        })
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__pilot.longtasks.push({
          start: entry.startTime,
          duration: entry.duration
        })
    }).observe({ type: 'longtask', buffered: true })
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Performance.enable')
  if (throttled) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu })
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: profile.latency,
      downloadThroughput: profile.throughput,
      uploadThroughput: profile.throughput
    })
  }
  const errors = [],
    warnings = [],
    failedResponses = [],
    scripts = new Set()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') warnings.push(message.text())
  })
  page.on('request', (request) => {
    if (
      request.url().startsWith(origins[mode]) &&
      request.resourceType() === 'script'
    )
      scripts.add(request.url())
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      const url = new URL(response.url())
      failedResponses.push(`${response.status()} ${url.origin}${url.pathname}`)
    }
  })
  return { context, page, cdp, errors, warnings, failedResponses, scripts }
}

async function loaded(page, mode, route) {
  const response = await page.goto(origins[mode] + route, {
    waitUntil: 'load',
    timeout: 90000
  })
  assert.equal(response.status(), 200)
  await page.waitForFunction(
    () => performance.getEntriesByName('lumen-pilot-hydrated').length > 0
  )
  await page.evaluate(() => document.fonts.ready)
}

async function domState(page) {
  return page.evaluate(() => {
    const box = (el) => {
      const r = el.getBoundingClientRect()
      return [r.x, r.y, r.width, r.height].map((x) => Math.round(x * 100) / 100)
    }
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document
        .querySelector('meta[name="robots"]')
        ?.content.replaceAll(' ', ''),
      language: document.documentElement.lang,
      alternates: [...document.querySelectorAll('link[hreflang]')].map(
        (el) => ({ lang: el.hreflang, href: el.href })
      ),
      jsonLd: [
        ...document.querySelectorAll('script[type="application/ld+json"]')
      ].map((el) => JSON.parse(el.textContent)),
      mainText: document.querySelector('main')?.innerText,
      footerText: document.querySelector('footer')?.innerText,
      headings: [...document.querySelectorAll('main h1,main h2')].map((el) => ({
        text: el.textContent,
        box: box(el),
        font: getComputedStyle(el).font
      })),
      layout: ['header', 'main', 'footer'].map((sel) => ({
        element: sel,
        box: document.querySelector(sel) && box(document.querySelector(sel))
      })),
      bodyHeight: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      missingComponents: document.body.innerText.includes(
        'has not been created yet.'
      ),
      brokenImages: [...document.images]
        .filter((img) => img.currentSrc && img.complete && !img.naturalWidth)
        .map((img) => img.currentSrc)
    }
  })
}

async function comparePixels(before, after) {
  const [a, b] = await Promise.all(
    [before, after].map((file) =>
      sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    )
  )
  if (a.info.width !== b.info.width || a.info.height !== b.info.height)
    return { sameDimensions: false, before: a.info, after: b.info }
  let changed = 0
  for (let i = 0; i < a.data.length; i += 4)
    if ([0, 1, 2].some((c) => Math.abs(a.data[i + c] - b.data[i + c]) > 16))
      changed++
  return {
    sameDimensions: true,
    changedPixels: changed,
    totalPixels: a.info.width * a.info.height,
    changedPercent: (changed / (a.info.width * a.info.height)) * 100
  }
}

async function visualChecks(browser) {
  for (const profile of profiles)
    for (const [routeIndex, route] of routes.entries()) {
      const pair = {}
      for (const mode of ['pages', 'app']) {
        console.log('Visual', mode, profile.name, route)
        const { context, page, errors, warnings, failedResponses, scripts } =
          await setup(browser, mode, profile, false)
        try {
          await loaded(page, mode, route)
          // Allow the existing four-second promo to appear, then use its normal
          // hide-on-scroll behavior. No screenshot masks or removed application UI.
          await page.waitForTimeout(6000)
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 1000) {
              scrollTo(0, y)
              await new Promise((resolve) => setTimeout(resolve, 15))
            }
            await Promise.allSettled(
              [...document.images]
                .filter((img) => img.currentSrc)
                .map((img) => img.decode())
            )
            scrollTo(0, 0)
          })
          await page.waitForTimeout(300)
          await page.addStyleTag({
            content:
              '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
          })
          const state = await domState(page)
          const screenshot = path.join(
            out,
            `${mode}-${routeIndex}-${profile.name}.png`
          )
          await page.screenshot({
            path: screenshot,
            fullPage: true,
            animations: 'disabled'
          })
          const javascript = await localJsSize(mode, [...scripts])
          const search = page
            .locator('[aria-haspopup="dialog"][data-lm-search-version]:visible')
            .first()
          assert.ok(await search.count(), 'Search opener missing')
          const start = performance.now()
          await search.click()
          await page.getByRole('dialog').waitFor()
          const searchOpenMs = performance.now() - start
          await page.getByRole('button', { name: 'Close search' }).click()
          await page.getByRole('dialog').waitFor({ state: 'hidden' })
          let drawer = false
          const toggle = page
            .getByRole('button', { name: 'Drawer left toggle' })
            .filter({ visible: true })
            .first()
          if (await toggle.count()) {
            await toggle.click()
            await page.locator('.MuiDrawer-paper:visible').first().waitFor()
            drawer = true
            await page.keyboard.press('Escape')
            const drawerBox = await page
              .locator('.MuiDrawer-paper')
              .first()
              .boundingBox()
            if (drawerBox && drawerBox.x + drawerBox.width > 1)
              await toggle.click()
          }
          // The existing footer link exercises native client navigation, keeping
          // the document alive; no synthetic router calls are used.
          await page.evaluate(() => {
            window.__pilotDocument = document.documentElement
          })
          const target =
            routeIndex === 0 ? '/imprint' : '/de/datenschutzerklaerung'
          const link = page.locator(`a[href="${target}"]`).first()
          let navigation = null
          if (routeIndex === 0 && (await link.count())) {
            await link.click()
            await page.waitForURL(origins[mode] + target)
            navigation = await page.evaluate(() => ({
              sameDocument: window.__pilotDocument === document.documentElement,
              text: document.querySelector('main')?.innerText.slice(0, 100)
            }))
            assert.ok(
              navigation.sameDocument,
              'Navigation reloaded the document'
            )
          }
          assert.deepEqual(errors, [])
          assert.equal(state.missingComponents, false)
          pair[mode] = {
            state,
            errors,
            warnings,
            failedResponses,
            screenshot: path.relative(repo, screenshot),
            javascript,
            searchOpenMs,
            drawer,
            navigation
          }
        } finally {
          await context.close()
        }
      }
      const comparison = {
        route,
        profile: profile.name,
        ...pair,
        sameContent:
          pair.pages.state.mainText === pair.app.state.mainText &&
          pair.pages.state.footerText === pair.app.state.footerText,
        sameHeadings:
          JSON.stringify(pair.pages.state.headings) ===
          JSON.stringify(pair.app.state.headings),
        pixels: await comparePixels(
          path.join(repo, pair.pages.screenshot),
          path.join(repo, pair.app.screenshot)
        )
      }
      report.visual.push(comparison)
      assert.ok(comparison.sameContent, 'Page or footer content changed')
      assert.ok(comparison.sameHeadings, 'Heading layout or typography changed')
      for (const field of [
        'title',
        'description',
        'canonical',
        'robots',
        'jsonLd',
        'language',
        'alternates'
      ])
        assert.deepEqual(
          pair.app.state[field],
          pair.pages.state[field],
          `Metadata changed: ${field}`
        )
      for (const mode of ['pages', 'app']) {
        assert.deepEqual(
          pair[mode].state.brokenImages,
          [],
          'Broken page images'
        )
        assert.equal(pair[mode].state.overflow, false, 'Horizontal overflow')
      }
      await save()
      console.log(
        'Parity',
        JSON.stringify({
          sameContent: comparison.sameContent,
          sameHeadings: comparison.sameHeadings,
          pixels: comparison.pixels
        })
      )
    }
}

async function noJavaScriptChecks(browser) {
  for (const mode of ['pages', 'app']) {
    const context = await browser.newContext({ javaScriptEnabled: false })
    await installAssets(context, origins[mode])
    try {
      for (const route of routes) {
        const page = await context.newPage()
        const response = await page.goto(origins[mode] + route, {
          waitUntil: 'load'
        })
        assert.equal(response.status(), 200)
        const text = await page.locator('main').innerText()
        assert.ok(text.length > 20000, 'Published content requires JavaScript')
        assert.ok(
          await page.locator('main h1').count(),
          'Prerendered heading missing'
        )
        const facebookFallbacks = await page
          // Browsers move the Pages Router's invalid head/noscript image into
          // body when scripting is off. Check the rendered fallback either way.
          .locator('img[src*="facebook.com/tr"]')
          .count()
        assert.equal(
          facebookFallbacks,
          1,
          'No-JavaScript tracking fallback missing'
        )
        report.noJavaScript.push({
          mode,
          route,
          mainTextLength: text.length,
          mainTextHash: hash(text),
          language: await page.locator('html').getAttribute('lang'),
          facebookFallbacks
        })
        await page.close()
      }
    } finally {
      await context.close()
    }
  }
}

async function performanceChecks(browser) {
  for (const profile of profiles)
    for (const route of routes)
      for (let run = 0; run < runs; run++) {
        for (const mode of run % 2 ? ['app', 'pages'] : ['pages', 'app']) {
          console.log('Measure', profile.name, route, run + 1, mode)
          const { context, page, cdp, errors, scripts } = await setup(
            browser,
            mode,
            profile,
            true
          )
          try {
            await loaded(page, mode, route)
            await page.waitForTimeout(1000)
            const timing = await page.evaluate(() => {
              const nav = performance.getEntriesByType('navigation')[0]
              const fcp = performance.getEntriesByName(
                'first-contentful-paint'
              )[0]
              const hydrated = performance.getEntriesByName(
                'lumen-pilot-hydrated'
              )[0]
              return {
                responseStartMs: nav.responseStart,
                domContentLoadedMs: nav.domContentLoadedEventEnd,
                fcpMs: fcp?.startTime,
                lcpMs: window.__pilot.lcp.at(-1)?.time,
                lcpElement: window.__pilot.lcp.at(-1)?.element,
                hydrationEffectMs: hydrated.startTime,
                totalBlockingMs: window.__pilot.longtasks.reduce(
                  (sum, t) => sum + Math.max(0, t.duration - 50),
                  0
                )
              }
            })
            // Include deferred chunks loaded by the existing four-second promotion.
            await page.waitForTimeout(5000)
            const initialLcpMs = timing.lcpMs
            const finalTiming = await page.evaluate(() => ({
              lcpMs: window.__pilot.lcp.at(-1)?.time,
              lcpElement: window.__pilot.lcp.at(-1)?.element,
              totalBlockingMs: window.__pilot.longtasks.reduce(
                (sum, task) => sum + Math.max(0, task.duration - 50),
                0
              )
            }))
            const cdpMetrics = Object.fromEntries(
              (await cdp.send('Performance.getMetrics')).metrics.map((x) => [
                x.name,
                x.value
              ])
            )
            const javascript = await localJsSize(mode, [...scripts])
            // The German page shows a marketing dialog after four seconds.
            // Dismiss through its existing hide-on-scroll behavior, after the
            // load metrics and chunk observation window have been captured.
            await page.evaluate(() => scrollTo(0, 500))
            await page.waitForTimeout(350)
            await page.evaluate(() => scrollTo(0, 0))
            await page.getByRole('dialog').waitFor({ state: 'hidden' })
            const search = page
              .locator(
                '[aria-haspopup="dialog"][data-lm-search-version]:visible'
              )
              .first()
            const start = performance.now()
            await search.click()
            await page.getByRole('dialog').waitFor()
            const searchOpenMs = performance.now() - start
            assert.deepEqual(errors, [])
            report.samples.push({
              mode,
              route,
              profile: profile.name,
              run: run + 1,
              ...timing,
              ...finalTiming,
              initialLcpMs,
              scriptDurationMs: cdpMetrics.ScriptDuration * 1000,
              taskDurationMs: cdpMetrics.TaskDuration * 1000,
              searchOpenMs,
              javascript
            })
            await save()
          } finally {
            await context.close()
          }
        }
      }
}

async function staticChecks() {
  for (const mode of ['pages', 'app']) {
    const before = await fs.readFile(
      path.join(work, mode, 'generation.log'),
      'utf8'
    )
    const hits = []
    for (const route of routes) {
      const response = await fetch(origins[mode] + route)
      assert.equal(response.status, 200)
      hits.push(response.headers.get('x-nextjs-cache'))
      await response.text()
    }
    assert.equal(
      await fs.readFile(path.join(work, mode, 'generation.log'), 'utf8'),
      before
    )
    if (mode === 'app') {
      const flight = await fetch(origins[mode] + routes[0] + '?_rsc=pilot', {
        headers: { RSC: '1' }
      })
      assert.match(flight.headers.get('content-type'), /text\/x-component/)
      await flight.text()
      assert.equal(
        await fs.readFile(path.join(work, mode, 'generation.log'), 'utf8'),
        before
      )
    }
    // Must run before browser navigation, with a freshly built server cache.
    const first = await fetch(origins[mode] + '/imprint')
    assert.equal(first.status, 200)
    const html = await first.text()
    const after = await fs.readFile(
      path.join(work, mode, 'generation.log'),
      'utf8'
    )
    assert.ok(
      after.length > before.length,
      'Rebuild the pilot to test a genuinely cold /imprint'
    )
    const second = await fetch(origins[mode] + '/imprint')
    assert.equal(await second.text(), html)
    assert.equal(
      await fs.readFile(path.join(work, mode, 'generation.log'), 'utf8'),
      after
    )
    const missing = await fetch(origins[mode] + '/not-a-pilot-page')
    assert.equal(missing.status, 404)
    report.staticContract[mode] = {
      known: hits,
      firstVisit: first.headers.get('x-nextjs-cache'),
      repeatedVisit: second.headers.get('x-nextjs-cache'),
      warmVisitCausesNoGeneration: true,
      missingStatus: missing.status
    }
  }
}

async function main() {
  await fs.mkdir(path.join(out, 'assets'), { recursive: true })
  for (const mode of ['pages', 'app'])
    for (const route of routes) {
      const file = `server/${mode}${mode === 'pages' && route === '/privacy-policy' ? '/en' : ''}${route}.html`
      const html = await fs.readFile(
        path.join(work, mode, '.next', file),
        'utf8'
      )
      const scripts = [
        ...html.matchAll(/<script\b[^>]+src="(\/_next\/[^"?]+\.js)/g)
      ].map((match) => origins[mode] + match[1])
      report.artifactSizes.push({
        mode,
        route,
        html: size(html),
        initialJavaScript: await localJsSize(mode, scripts)
      })
    }
  if (process.argv.includes('--reuse-static')) {
    const previous = JSON.parse(
      await fs.readFile(path.join(out, 'report.json'), 'utf8')
    )
    assert.deepEqual(
      report.artifactSizes,
      previous.artifactSizes,
      'Cannot reuse SSG checks after rebuilding'
    )
    assert.ok(
      previous.staticContract.pages && previous.staticContract.app,
      'No previous SSG proof'
    )
    report.staticContract = previous.staticContract
    report.staticVerifiedAt = previous.staticVerifiedAt || previous.measuredAt
  } else if (!process.argv.includes('--skip-static')) await staticChecks()
  const browser = await chromium.launch({ headless: true })
  try {
    await noJavaScriptChecks(browser)
    await visualChecks(browser)
    if (!visualOnly) await performanceChecks(browser)
  } finally {
    await browser.close()
    await save()
  }
  console.log('Report:', path.join(out, 'report.json'))
}
main().catch(async (error) => {
  console.error(error)
  await save()
  process.exitCode = 1
})
