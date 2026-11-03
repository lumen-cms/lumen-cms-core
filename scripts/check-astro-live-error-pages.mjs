import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { parseEnv } from 'node:util'
import { load } from 'cheerio'
import { chromium } from 'playwright'
import lumenStoryblok from '../packages/lumen-cms-astro/integration.mjs'
import { lumenImageConfig } from '../packages/lumen-cms-astro/src/images/config.mjs'
import { localeErrorRouting } from '../packages/lumen-cms-astro/build/error-routing.mjs'
import legacyEnvironment from './astro-env.cjs'
const { astroEnv } = legacyEnvironment
const root = resolve('packages/lumen-cms-astro')
const require = createRequire(join(root, 'package.json'))
const { build } = await import(pathToFileURL(require.resolve('astro')))
const { default: node } = await import(pathToFileURL(require.resolve('@astrojs/node')))
const { default: tailwind } = await import(pathToFileURL(require.resolve('@tailwindcss/vite')))
const temp = await mkdtemp(join(root, '.live-error-test-'))
const output = resolve('/tmp/lumen-live-404')
const sites = { bali: ['en','de','id'], planet: ['en','de','it','es'], upskill: ['en','de'] }
const results = []
let server, browser
const normalize = value => value.replace(/\s+/g, ' ').trim()
const signature = ($, selector) => ({ text: normalize($(selector).text()), links: $(selector).find('a').map((_, el) => $(el).attr('href') || '').get(), images: $(selector).find('img').map((_, el) => [$(el).attr('src'), $(el).attr('alt')].join('|')).get() })
try {
 await mkdir(join(temp, 'src/pages/audit-reference'), { recursive: true }); await mkdir(output, { recursive: true })
 await writeFile(join(temp, 'src/pages/audit-reference/[locale].astro'), `---
import SiteLayout from ${JSON.stringify(join(root, 'src/layouts/SiteLayout.astro'))}
import getPageProps from 'lumen-cms-shared/core/utils/initial-props/getPageProps'
const locales = process.env.LUMEN_LOCALES.split(',')
const page = await getPageProps('error-404', { locale: Astro.params.locale, defaultLocale: locales[0], locales, insideStoryblok: false }, { version: 'published' })
page.pageNotFound = true
Astro.response.headers.set('X-Audit-Story', page.page?.uuid || 'missing')
Astro.response.headers.set('X-Audit-Settings', page.settings?.uuid || 'missing')
---
<SiteLayout page={page} />`)
 await build({ root, configFile: false, srcDir: join(temp, 'src/'), outDir: join(temp, 'dist/'), publicDir: resolve('public'), output: 'server', image: lumenImageConfig, adapter: node({ mode: 'standalone' }), integrations: [lumenStoryblok({ preview: true }), localeErrorRouting()], vite: { plugins: [tailwind()], ssr: { noExternal: ['lumen-cms-shared'] } } })
 browser = await chromium.launch({ headless: true })
 for (const [site, locales] of Object.entries(sites)) {
  const env = astroEnv({ ...process.env, ...parseEnv(await readFile(`.env.${site}`, 'utf8')), LUMEN_LOCALES: locales.join(','), NODE_ENV: 'production' })
  const socket = createServer(); await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve)); const port = socket.address().port; await new Promise(resolve => socket.close(resolve))
  server = spawn(process.execPath, [join(temp, 'dist/server/entry.mjs')], { env: { ...env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })
  // Consume logs without printing request credentials or response objects.
  let diagnostics = ''
  server.stderr.on('data', chunk => { diagnostics += chunk.toString() })
  await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error('Server startup timeout')), 15000); server.stdout.on('data', () => { clearTimeout(timer); resolve() }); server.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)) }) })
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } })
  for (const locale of locales) {
   const record = { site, locale, passed: false }
   try {
    const token = env.PUBLIC_STORYBLOK_TOKEN
    const localePrefix = locale !== locales[0] || env.PUBLIC_ENABLE_LOCALE_SUFFIX ? locale : ''
    const slug = [!env.PUBLIC_FIELD_LEVEL_TRANSLATION && localePrefix, env.PUBLIC_ROOT_DIRECTORY, 'error-404'].filter(Boolean).join('/')
    const url = new URL(`https://api.storyblok.com/v2/cdn/stories/${slug}`); url.searchParams.set('token', token); url.searchParams.set('version', 'published'); if (env.PUBLIC_FIELD_LEVEL_TRANSLATION && localePrefix) url.searchParams.set('language', locale)
    const storyResponse = await fetch(url)
    record.storySlug = slug; record.storyStatus = storyResponse.status
    const story = storyResponse.ok ? (await storyResponse.json()).story : undefined
    const origin = `http://127.0.0.1:${port}`
    const missing = `${origin}/${locale === locales[0] ? '' : locale + '/'}__lumen_missing_404_verification__`
    const [response, reference] = await Promise.all([fetch(missing), fetch(`${origin}/audit-reference/${locale}`)])
    const html = await response.text(), referenceHtml = await reference.text()
    const $ = load(html), expected = load(referenceHtml)
    record.status = response.status; record.storyUuid = reference.headers.get('x-audit-story'); record.settingsUuid = reference.headers.get('x-audit-settings')
    record.title = $('title').text(); record.body = signature($, 'main'); record.header = signature($, 'header'); record.footer = signature($, 'footer')
    assert.equal(response.status, 404); assert.equal(response.redirected, false); assert.equal($('html').attr('lang'), locale)
    assert.equal(reference.status, 200)
    const screenshotPage = await context.newPage(); await screenshotPage.goto(missing, { waitUntil: 'load' }); await screenshotPage.screenshot({ path: join(output, `${site}-${locale}.png`), fullPage: true }); await screenshotPage.close()
    assert(story, `No published Storyblok story at ${slug}`)
    assert.equal(record.storyUuid, story.uuid)
    assert.equal($('header').length, 1, 'Missing header'); assert.equal($('footer').length, 1, 'Missing footer')
    for (const section of ['main', 'header', 'footer']) assert.deepEqual(signature($, section), signature(expected, section), `${section} differs from direct CMS rendering`)
    assert(record.body.text, 'Empty body'); assert(record.footer.text || record.footer.links.length, 'Empty footer')
    record.passed = true
   } catch (error) { record.error = error.message; let safe = diagnostics; for (const [key, value] of Object.entries(env)) if (/TOKEN|KEY|SECRET|PASSWORD/i.test(key) && value) safe = safe.split(value).join('[redacted]'); await writeFile(join(output, `${site}-diagnostics.log`), safe) }
   results.push(record)
   console.log(JSON.stringify({ site, locale, passed: record.passed, storyStatus: record.storyStatus, status: record.status, body: record.body?.text.slice(0, 180), error: record.error }))
   await writeFile(join(output, 'report.json'), JSON.stringify(results, null, 2))
  }
  await context.close(); server.kill(); await new Promise(resolve => server.once('exit', resolve)); server = undefined
 }
 if (results.some(result => !result.passed)) process.exitCode = 1
} finally {
 if (server && server.exitCode === null) { server.kill(); await new Promise(resolve => server.once('exit', resolve)) }
 await browser?.close(); await rm(temp, { recursive: true, force: true })
}
