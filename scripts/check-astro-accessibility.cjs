// Audit built CMS samples. No submissions or external provider scripts are executed.
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')
const sites = require('../test/websites/sites.json')
const axePath = require.resolve('axe-core/axe.min.js')
const selected = process.argv.slice(2)
const requestedSites = selected.filter(arg => !arg.startsWith('--'))
const names = requestedSites.length ? requestedSites : ['bali', 'planet', 'upskill']
const onlyRoute = selected.find(arg => arg.startsWith('--route='))?.slice(8)
const types = { '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' }
async function main() {
 const browser = await chromium.launch()
 const reports = []
 try {
  for (const site of names) {
   if (!sites[site]) throw new Error(`Unknown site: ${site}`)
   const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist', site)
   const server = http.createServer(async (req, res) => {
    try {
     let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname))
     if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return }
     if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
     res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(await fs.readFile(file))
    } catch { res.writeHead(404).end() }
   })
   await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
   const origin = `http://127.0.0.1:${server.address().port}`
   const jobs = sites[site].routes.filter(route => !onlyRoute || route === onlyRoute).flatMap(route => [1280, 320].map(width => ({ route, width })))
   try {
    await Promise.all(Array.from({ length: 3 }, async () => {
     while (jobs.length) {
      const job = jobs.shift()
      const page = await browser.newPage({ viewport: { width: job.width, height: 900 }, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.route('**/*', route => {
       const request = route.request()
       if (request.method() !== 'GET' || (['script', 'document'].includes(request.resourceType()) && !request.url().startsWith(origin))) return route.abort()
       return route.continue()
      })
      try {
       const response = await page.goto(origin + job.route, { waitUntil: 'domcontentloaded', timeout: 30000 })
       await page.evaluate(async () => { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 3000))]); for (let y = 0; y < Math.min(document.body.scrollHeight, 30000); y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 20)) } scrollTo(0, 0) })
       await page.addScriptTag({ path: axePath })
       const states = [{ name: 'page' }]
       const scan = async name => {
        const result = await page.evaluate(async () => {
         const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })
         return { violations: result.violations, incomplete: result.incomplete, passes: result.passes.length, overflow: document.documentElement.scrollWidth > innerWidth + 1 }
        })
        return { name, ...result }
       }
       states[0] = await scan('page')
       const skip = page.locator('.lm-skip-link')
       await skip.focus(); await skip.press('Enter')
       if (!(await page.locator('#lm-main-content').evaluate(el => el === document.activeElement))) throw new Error('Skip link did not focus main content')
       const tab = page.locator('[data-lm-tabs]').first().locator('[role=tab]').nth(1)
       if (await tab.count()) { await tab.click({ timeout: 5000 }); states.push(await scan('tab-selected')) }
       const menu = page.locator('button[data-menu-trigger]:visible').first()
       if (await menu.count()) { await menu.focus(); await menu.press('ArrowDown'); states.push(await scan('menu-open')); await page.keyboard.press('Escape') }
       const form = page.locator('[data-lm-google-form] form, [data-lm-form-builder] form').first()
       if (await form.count()) { await form.evaluate(form => form.reportValidity()); states.push(await scan('form-validation')) }
       // Open a representative disclosure and search dialog without sending requests.
       const disclosure = page.locator('details.lm-accordion-item').first()
       if (await disclosure.count()) { await disclosure.evaluate(el => { el.open = true }); states.push(await scan('accordion-open')) }
       const search = page.locator('[data-search-trigger]:visible').first()
       if (await search.count()) { await search.click({ timeout: 5000 }); states.push(await scan('search-open')); await page.keyboard.press('Escape') }
       reports.push({ site, ...job, status: response.status(), errors, states })
      } catch (error) { reports.push({ site, ...job, error: String(error), errors }) }
      finally { await page.close() }
     }
    }))
   } finally { await new Promise(resolve => server.close(resolve)) }
   console.log(`Audited ${site}: ${reports.filter(r => r.site === site).length} page/viewport combinations`)
  }
 } finally { await browser.close() }
 const output = path.resolve(__dirname, '../.website-tests/astro-accessibility')
 await fs.mkdir(output, { recursive: true })
 const summary = {}
 for (const report of reports) {
  const entry = summary[report.site] ||= { pages: 0, failures: 0, overflow: 0, violations: {} }
  entry.pages++; if (report.error || report.status !== 200) entry.failures++
  if (report.states?.[0]?.overflow) entry.overflow++
  for (const state of report.states || []) for (const rule of state.violations) entry.violations[rule.id] = (entry.violations[rule.id] || 0) + rule.nodes.length
 }
 await fs.writeFile(path.join(output, onlyRoute ? 'report-targeted.json' : 'report.json'), JSON.stringify({ generated: new Date().toISOString(), limitations: 'Automated Chromium checks; external provider scripts/frames blocked; incomplete results require manual review. No screen-reader verification.', summary, reports }, null, 2))
 console.log(JSON.stringify(summary, null, 2))
 if (!onlyRoute) require('./report-astro-accessibility-ownership.cjs')
 if (reports.some(r => r.error || r.status !== 200 || r.states.some(s => s.violations.length || s.overflow))) process.exitCode = 1
}
main().catch(error => { console.error(error); process.exitCode = 1 })
