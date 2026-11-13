const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')
async function main() {
 const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture')
 const server = http.createServer(async (req, res) => {
  try {
   const name = new URL(req.url, 'http://localhost').pathname
   const file = path.resolve(root, '.' + name)
   if (!file.startsWith(root + path.sep)) return res.writeHead(403).end()
   let body = await fs.readFile(file)
   if (name.endsWith('.html')) body = Buffer.from(body.toString().replace('data-auth-enabled="false"', 'data-auth-enabled="true"'))
   res.setHeader('Content-Type', name.endsWith('.js') ? 'text/javascript' : name.endsWith('.css') ? 'text/css' : 'text/html'); res.end(body)
  } catch { res.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 const browser = await chromium.launch({ headless: true })
 try {
  const page = await browser.newPage()
  await page.route('**/*', async route => {
   if (!route.request().url().startsWith(`http://127.0.0.1:${server.address().port}`)) return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' })
   return route.continue()
  })
  let sessionAttempts = 0, sdkAttempts = 0
  await page.route('**/api/auth/session', route => {
   sessionAttempts++
   return route.fulfill({ status: sessionAttempts === 1 ? 503 : 200, json: { user: { sub: 'auth0|fixture', email: 'buyer@example.test', id: 'buyer', roles: [] } } })
  })
  await page.route('https://example.test/fastspring-fixture.js', route => {
   sdkAttempts++
   if (sdkAttempts === 1) return route.abort()
   return route.fulfill({ contentType: 'text/javascript', body: `window.__checkoutPayloads=[];window.fastspring={builder:{push(data){window.__checkoutPayloads.push(data)},checkout(){}}};window.fscDataCallback({currency:'USD',groups:[{items:[]},{items:[{path:'fixture-course',price:'$12',total:'$10',priceValue:12}]}]});` })
  })
  await page.goto(`http://127.0.0.1:${server.address().port}/__navigation/index.html`)
  const product = page.locator('[data-lm-fastspring-product]').first()
  await product.locator('[data-commerce-retry]').waitFor({ state: 'visible' })
  assert.equal(await product.locator('[data-fastspring-trigger] button').isDisabled(), true)
  await product.locator('[data-commerce-retry]').click()
  const buy = product.getByRole('button', { name: 'Buy fixture for $12', exact: true })
  await buy.click()
  assert.deepEqual(await page.evaluate(() => window.__checkoutPayloads), [{ products: [{ path: 'fixture-course', quantity: 1 }], tags: { sub: 'auth0|fixture', email: 'buyer@example.test', id: 'buyer' } }])
  assert.equal(await buy.isDisabled(), true)
  await page.evaluate(() => window.fscDataPopupClosed(null))
  await buy.focus()
  await page.evaluate(() => window.fscDataCallback({ currency: 'EUR', groups: [{ items: [{ path: 'fixture-course', price: '<b>€14</b>', total: '€14', priceValue: 14 }] }] }))
  assert.equal(await product.locator('[data-fastspring-trigger] b').count(), 0)
  assert.equal(await product.locator('button').first().evaluate(node => node === document.activeElement), true)
  await page.getByRole('heading', { name: 'Total fixture €14', exact: true }).click()
  assert.equal(await page.evaluate(() => window.__checkoutPayloads.length), 1)
  await product.locator('button').first().click()
  await page.evaluate(() => window.fscDataPopupClosed({ id: 'order', reference: 'ref' }))
  assert.match(await product.locator('[role=status]').textContent(), /Checkout completed/)
  assert.equal(new URL(page.url()).pathname, '/__navigation/index.html')
  assert.equal(sessionAttempts, 2); assert.equal(sdkAttempts, 2)
  console.log('Commerce browser checks pass: auth/SDK retry, tags, groups, click lock, cancellation, text-only, safe prices, focus, completion.')
 } finally { await browser.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
