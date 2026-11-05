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
  browser = await chromium.launch()
  const origin = `http://127.0.0.1:${server.address().port}`
  for (const width of [390, 1280]) {
   const page = await browser.newPage({ viewport: { width, height: 844 } })
   await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort())
   await page.goto(`${origin}/__fixture/`, { waitUntil: 'networkidle' })
   const count = await page.evaluate(() => {
    // Include dialogs normally mounted lazily from templates.
    document.querySelectorAll('template').forEach(template => {
     const dialog = template.content.querySelector('dialog')
     if (dialog) document.body.append(dialog.cloneNode(true))
    })
    const opener = document.createElement('button')
    opener.id = 'focus-test-opener'; opener.textContent = 'Open'; document.body.prepend(opener)
    const dialogs = [...document.querySelectorAll('dialog')]
    dialogs.forEach((dialog, index) => { dialog.close(); dialog.dataset.focusTest = String(index) })
    return dialogs.length
   })
   assert(count > 5, 'Fixture must cover multiple dialog types')
   const covered = new Set()
   for (let index = 0; index < count; index++) {
    const dialog = page.locator(`[data-focus-test="${index}"]`)
    const kind = await dialog.evaluate(el => el.className + ' #' + el.id)
    await page.locator('#focus-test-opener').focus()
    await dialog.evaluate(el => el.showModal())
    if (!await dialog.isVisible()) { await dialog.evaluate(el => el.close()); continue }
    covered.add(kind)
    const search = await dialog.evaluate(el => el.classList.contains('lm-search-dialog'))
    assert.equal(await dialog.evaluate((el, search) => {
     const target = el.querySelector(search ? 'input[type="search"]' : '[data-dialog-initial-focus]')
     return !!target && document.activeElement === target && (search || getComputedStyle(target).outlineStyle === 'none')
    }, search), true, `${kind}: initial focus at ${width}px`)
    if (!search) {
     await page.keyboard.press('Tab')
     assert.equal(await dialog.evaluate(el => {
      const active = document.activeElement
      return el.contains(active) && !active.hasAttribute('data-dialog-initial-focus') && active.matches(':focus-visible')
     }), true, `${kind}: visible keyboard focus at ${width}px`)
    }
    await dialog.evaluate(el => el.close())
    assert.equal(await page.locator('#focus-test-opener').evaluate(el => document.activeElement === el), true, `${kind}: restore opener focus`)
   }
   if (width < 600) {
    const toggle = page.getByRole('button', { name: 'Drawer left toggle' })
    await toggle.click()
    assert.equal(await page.locator('#lm-left-drawer > [data-dialog-initial-focus]').evaluate(el => document.activeElement === el), true)
    await page.keyboard.press('Escape')
    assert.equal(await toggle.evaluate(el => document.activeElement === el), true)
   }
   // Verify the real search opener still focuses the editable input.
   await page.getByRole('button', { name: 'Search fixture', exact: true }).click()
   assert.equal(await page.locator('.lm-search-dialog[open] input').evaluate(el => document.activeElement === el), true)
   await page.keyboard.press('Escape')
   console.log(`${width}px: focus checks passed for ${covered.size} visible dialogs (${[...covered].join(', ')})`)
   await page.close()
  }
 } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
