const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')
const { buildSync } = require('esbuild')
const editableScript = buildSync({ entryPoints: [path.resolve(__dirname, '../packages/lumen-cms-astro/src/client/storyblokEditable.ts')], bundle: true, write: false, format: 'iife', globalName: 'fixtureEditable' }).outputFiles[0].text

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
  for (const width of [375, 599, 600, 899, 900, 1280]) {
   await page.setViewportSize({ width, height: 812 })
   await page.goto(`http://127.0.0.1:${server.address().port}/__fixture/`)
   await page.waitForFunction(() => document.querySelector('#popover-regression-fixture [data-lm-menu]')?.dataset.initialized)
      await page.addScriptTag({ content: editableScript })
      await page.evaluate(() => window.fixtureEditable.initializeStoryblokEditable())
      await page.locator('#popover-regression-fixture').evaluate(el => { el.hidden = false })
      for (const preview of [false, true]) {
        const trigger = page.getByRole('button', { name: `Notifications ${preview}`, exact: true })
        await trigger.click()
        const panel = page.locator(`#menu-popover-${preview}`)
        const geometry = await panel.evaluate(el => {
          const rect = el.getBoundingClientRect()
          return { horizontalOverflow: getComputedStyle(el).overflowX, left: rect.left, right: rect.right, topLayer: el.matches(':popover-open'), contentFits: el.scrollWidth <= el.clientWidth }
        })
        assert.equal(geometry.horizontalOverflow, 'hidden')
        assert.equal(geometry.contentFits, true, 'Long notification text must wrap within the panel')
        assert(geometry.left >= 0 && geometry.right <= width)
        assert.equal(geometry.topLayer, !preview)
        assert.equal(await panel.locator('.lm-card-cover-link').count(), preview ? 0 : 1)
        if (preview) {
          const text = panel.getByText('Editable notification text', { exact: true })
          await text.scrollIntoViewIfNeeded()
          assert.equal(await text.evaluate(el => {
            const rect = el.getBoundingClientRect()
            return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('[data-blok-uid]')?.getAttribute('data-blok-uid')
          }), '123-notification-text-true', 'The rich text itself must receive pointer hit testing, not the Card cover link')
          await page.evaluate(() => {
            document.addEventListener('click', event => {
              window.fixtureSelectedBlok = event.target.closest('[data-blok-uid]')?.getAttribute('data-blok-uid')
            }, { once: true })
          })
          await text.click()
          assert.equal(await page.evaluate(() => window.fixtureSelectedBlok), '123-notification-text-true')
          assert.equal(page.context().pages().length, 1, 'Editing notification text must not open a tab')
          assert.equal(await panel.locator('template[data-lm-editable-start="notification-true"]').count(), 1)
          // Model the Bridge's document-level click surface: it must be hittable
          // above the panel, otherwise selecting a nested blok never reaches it.
          await panel.evaluate(el => {
            const rect = el.getBoundingClientRect()
            const overlay = document.createElement('button')
            overlay.id = 'editor-selection-overlay'
            overlay.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;z-index:2147483647`
            overlay.addEventListener('click', () => { overlay.dataset.selected = 'notification-true' })
            document.body.append(overlay)
          })
          const overlay = page.locator('#editor-selection-overlay')
          await overlay.click()
          assert.equal(await overlay.getAttribute('data-selected'), 'notification-true')
          await overlay.evaluate(el => el.remove())
        } else {
          await trigger.click()
        }
      }
      await page.locator('#popover-regression-fixture').evaluate(el => { el.hidden = true })
  }
  assert.deepEqual(errors, [])
  console.log('Popover regressions: wrapping, viewport bounds and editor overlay clicks passed at six widths')
 } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
