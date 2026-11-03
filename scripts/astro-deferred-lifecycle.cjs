const assert = require('node:assert/strict')

async function checkDeferredLifecycle(browser, origin, chunks) {
 const context = await browser.newContext()
 const page = await context.newPage(), errors = []
 page.on('pageerror', error => errors.push(error.message))
 const calendarFiles = [...chunks].filter(([, chunk]) => chunk.modules.some(id => /client\/calendar\.ts$/.test(id))).map(([file]) => file)
 assert(calendarFiles.length, 'Calendar runtime metadata must be present')
 let release, requested
 const held = new Promise(resolve => { release = resolve })
 const started = new Promise(resolve => { requested = resolve })
 await page.route('**/*', async route => {
  const url = new URL(route.request().url())
  if (calendarFiles.includes(url.pathname)) { requested(); await held }
  return url.origin === origin ? route.continue() : route.abort()
 })
 await page.goto(origin + '/bundle-fixtures/calendar-below/', { waitUntil: 'networkidle' })
 const html = await page.locator('[data-lm-calendar]').evaluate(root => root.outerHTML)
 await page.locator('[data-lm-calendar]').scrollIntoViewIfNeeded()
 await started
 await page.locator('[data-lm-calendar]').evaluate(root => { root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true })); root.remove() })
 release(); await page.waitForLoadState('networkidle')
 assert.equal(await page.locator('[data-calendar-initialized]').count(), 0, 'Removed calendar must not mount when its import finishes')
 await page.evaluate(html => { const host = document.createElement('div'); host.innerHTML = html; document.body.append(host); document.dispatchEvent(new Event('lumen:content-mounted')); document.dispatchEvent(new Event('lumen:content-mounted')) }, html)
 await page.locator('[data-lm-calendar]').scrollIntoViewIfNeeded()
 await page.waitForSelector('[data-calendar-initialized=true][data-deferred-state=ready]')
 assert.equal(await page.locator('[data-calendar-view] option').count(), 4)
 const title = await page.locator('[data-calendar-label]').innerText()
 await page.getByRole('button', { name: 'nächste', exact: true }).click()
 assert.notEqual(await page.locator('[data-calendar-label]').innerText(), title)
 await page.locator('[data-lm-calendar]').evaluate(root => { root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true })); document.dispatchEvent(new Event('lumen:content-mounted')) })
 await page.waitForSelector('[data-calendar-initialized=true][data-deferred-state=ready]')
 assert.equal(await page.locator('[data-calendar-view] option').count(), 4, 'Remount must not duplicate controls')
 assert.deepEqual(errors, [])
 await context.close()
 const reduced = await browser.newContext({ reducedMotion: 'reduce' }), motionPage = await reduced.newPage(), files = []
 motionPage.on('request', request => { const url = new URL(request.url()); if (url.pathname.endsWith('.js')) files.push(url.pathname) })
 await motionPage.goto(origin + '/bundle-fixtures/parallax-below/', { waitUntil: 'networkidle' })
 await motionPage.locator('[data-lm-parallax]').scrollIntoViewIfNeeded()
 await motionPage.waitForSelector('[data-lm-parallax=static]')
 assert.equal(files.flatMap(file => chunks.get(file)?.modules || []).some(id => /node_modules\/parallax-controller\//.test(id)), false, 'Reduced motion must not download parallax-controller')
 await reduced.close()
}
module.exports = { checkDeferredLifecycle }
