const assert = require('node:assert/strict')

// Exercise the production SDK, but intercept every storefront request and navigation.
async function checkShopifyCheckout(page) {
 const product = page.locator('[data-lm-shopify-product]')
 const button = product.locator('[data-shopify-checkout] button')
 const error = product.locator('[data-shopify-error]')
 let requests = 0, release
 const held = new Promise(resolve => { release = resolve })
 const origin = new URL(page.url()).origin
 const sdkRequests = []
 page.on('request', request => { if (request.url().endsWith('.js')) sdkRequests.push(request.url()) })
 await page.evaluate(() => { window.checkoutEvents = []; window.gtag = (...args) => window.checkoutEvents.push(args) })
 await page.route('https://fixture.myshopify.com/api/2021-07/graphql.json', async route => {
  requests++
  const input = route.request().postDataJSON().variables.input
  assert.equal(route.request().headers()['x-shopify-storefront-access-token'], 'public-test-token')
  assert.deepEqual(input, { allowPartialAddresses: true, lineItems: [{ variantId: 'variant-1', quantity: requests === 1 ? 1 : 2 }] })
  if (requests === 1) {
   await held
   await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ errors: [{ message: 'Fixture unavailable' }] }) })
  } else {
   await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: { checkoutCreate: { checkout: { id: 'mock', webUrl: origin + '/mock-checkout' }, checkoutUserErrors: [] } } }) })
  }
 })
 await page.route(origin + '/mock-checkout', route => route.fulfill({ contentType: 'text/html', body: '<h1>Mock checkout destination</h1>' }))
 await Promise.all([page.waitForRequest('https://fixture.myshopify.com/api/2021-07/graphql.json'), button.click()])
 assert(await button.isDisabled(), 'Checkout stays disabled while SDK/request is pending')
 await button.evaluate(node => { node.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
 assert.equal(requests, 1, 'Pending checkout cannot be submitted twice')
 release()
 await error.waitFor({ state: 'visible' })
 assert.equal(await button.isDisabled(), false)
 assert.equal(await page.evaluate(() => window.checkoutEvents.some(args => args[1] === 'begin_checkout')), false)
 const loaded = [...sdkRequests]
 await product.locator('[data-shopify-add] button').click()
 const cart = page.getByRole('dialog', { name: 'Shopping cart' })
 await cart.getByRole('button', { name: 'Increase Large quantity' }).click()
 assert.equal(await cart.getByRole('spinbutton', { name: 'Large quantity' }).inputValue(), '2')
 await Promise.all([page.waitForURL(origin + '/mock-checkout'), cart.locator('[data-cart-checkout] button').click()])
 assert.equal(requests, 2)
 assert.deepEqual(sdkRequests, loaded, 'The SDK is reused for a cart checkout retry')
 assert.equal(await page.getByRole('heading', { name: 'Mock checkout destination' }).count(), 1)
}
async function checkShopifyLoadFailure(context, origin, sdkFiles) {
 const page = await context.newPage()
 let sdkRequests = 0, storefrontRequests = 0
 const errors = []
 page.on('pageerror', error => errors.push(error.message))
 await page.route('**/*', route => {
  const url = new URL(route.request().url())
  if (sdkFiles.includes(url.pathname)) { sdkRequests++; return route.abort() }
  if (url.hostname === 'fixture.myshopify.com') storefrontRequests++
  return url.origin === origin ? route.continue() : route.abort()
 })
 await page.goto(origin + '/bundle-fixtures/shopify-checkout/', { waitUntil: 'networkidle' })
 assert.equal(sdkRequests, 0)
 const button = page.locator('[data-shopify-checkout] button')
 await button.click()
 await page.locator('[data-shopify-error]').waitFor({ state: 'visible' })
 assert.equal(await button.isDisabled(), false, 'A failed SDK download restores the checkout button')
 assert(sdkRequests > 0)
 assert.equal(storefrontRequests, 0)
 assert.deepEqual(errors, [], 'SDK load errors are handled by the checkout UI')
 await page.close()
}
module.exports = { checkShopifyCheckout, checkShopifyLoadFailure }
