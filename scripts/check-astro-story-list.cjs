const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require('playwright')

async function main() {
 const root = path.resolve(__dirname, '../packages/lumen-cms-astro/dist/fixture')
 const server = http.createServer(async (request, response) => {
  try {
   const pathname = new URL(request.url, 'http://localhost').pathname
   const file = path.resolve(root, '.' + (pathname === '/' ? '/__story_list/index.html' : pathname))
   if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return }
   const body = await fs.readFile(file)
   response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html'); response.end(body)
  } catch { response.writeHead(404).end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 let browser
 try {
  browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = [], requests = []
  const categoryRequests = []
  let categoryFail = false
  await page.route('**/api/categories?*', async route => {
   const url = new URL(route.request().url()); categoryRequests.push(url)
   if (categoryFail) { categoryFail = false; await route.fulfill({ status: 500, body: '{}' }); return }
   await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ city: [{ id: 1, title: 'City A', title_de: 'Stadt A', travels_aggregate: { aggregate: { count: 1 } } }, { id: 2, title: 'City B', title_de: 'Stadt B', travels_aggregate: { aggregate: { count: 1 } } }], branch: [], travel_type: [], country: [] }) })
  })
  let failOnce = true
  page.on('pageerror', error => errors.push(error.message))
  await page.route('https://a.storyblok.com/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') }))
  await page.route('https://api.storyblok.com/**', async route => {
   const url = new URL(route.request().url()); requests.push(url)
   const search = url.searchParams.get('search_term')
   if (search === 'error' && failOnce) { failOnce = false; await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Fixture failure' }) }); return }
   if (search === 'old') await new Promise(resolve => setTimeout(resolve, 150))
   const stories = search === 'empty' ? [] : [{ uuid: `page-${url.searchParams.get('page')}`, full_slug: 'fetched-story', name: 'Fetched story', content: { component: 'page', preview_title: search || '<img src=x onerror=alert(1)>', preview_teaser: search === 'rich' ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Dynamic linked text', marks: [{ type: 'link', attrs: { href: 'de/home?from=list#details', linktype: 'story', target: '_blank' } }, { type: 'bold' }] }] }] } : 'Long description for truncation', preview_subtitle: 'Fetched subtitle', ...(search === 'image' ? { preview_image: 'https://a.storyblok.com/f/123/1200x800/fixture-image.jpg' } : {}) } }]
   await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-expose-headers': 'total,per-page', total: search === 'empty' ? '0' : '6', 'per-page': '2' }, body: JSON.stringify({ stories, cv: 1, rels: [], links: [] }) })
  })
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  const list = page.locator('[data-story-list]')
  await list.scrollIntoViewIfNeeded()
  assert.match(await list.locator('[data-story-results]').innerText(), /Native news title/)
  assert.equal(requests.length, 0)
  await list.getByRole('button', { name: 'Go to page 2', exact: true }).first().click()
  await page.waitForFunction(() => document.querySelector('[data-story-list]')?.getAttribute('aria-busy') === 'false')
  assert.equal(requests.at(-1).searchParams.get('version'), 'published')
  assert.equal(requests.at(-1).searchParams.get('page'), '2')
  assert.equal(requests.at(-1).searchParams.get('per_page'), '2')
  assert.match(await list.locator('[data-story-results]').innerText(), /<img src=x onerror=alert\(1\)>/)
  assert.match(await list.locator('[data-story-results]').innerText(), /Long des\.\./)
  assert.equal(await list.locator('[data-story-results] img').count(), 0)
  assert.equal(await list.locator('[data-story-results] a').getAttribute('href'), '/fetched-story')
  assert.equal(await list.locator('[aria-current="page"]').count(), 2)
  await page.evaluate(() => {
   for (const text of ['old', 'new']) { const url = new URL(location.href); url.searchParams.set('search__text', text); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) }
  })
  await page.waitForFunction(() => document.querySelector('[data-story-results]')?.textContent?.includes('new'))
  await page.waitForTimeout(250)
  assert.match(await list.locator('[data-story-results]').innerText(), /new/)
  assert.equal(new URL(page.url()).searchParams.get('page'), '1')
  await page.evaluate(() => { const url = new URL(location.href); url.searchParams.set('search__text', 'empty'); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) })
  await list.getByText('No matching stories').waitFor({ state: 'visible' })
  assert.equal(await list.locator('[data-story-pagination]:visible').count(), 0)
  await page.evaluate(() => { const url = new URL(location.href); url.searchParams.set('search__text', 'error'); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) })
  await list.locator('[data-story-error]').waitFor({ state: 'visible' })
  await list.getByRole('button', { name: 'Retry', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[data-story-results]')?.textContent?.includes('error'))
  assert.equal(await list.locator('[data-story-error]').isVisible(), false)
  await page.evaluate(() => { const url = new URL(location.href); url.searchParams.delete('search__text'); url.searchParams.set('page', '3'); history.replaceState({}, '', url); dispatchEvent(new PopStateEvent('popstate')) })
  await page.waitForFunction(() => document.querySelector('[data-story-results] [data-lm-list-item]')?.getAttribute('data-lm-list-item') === 'page-3')
  await page.evaluate(() => { const url = new URL(location.href); url.searchParams.set('search__text', 'image'); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) })
  const fetchedImage = list.locator('[data-story-results] img')
  await fetchedImage.waitFor({ state: 'visible' })
  assert.match(await fetchedImage.getAttribute('src'), /\/fixture-image\.jpg\/m\/1200x0\//)
  assert.match(await fetchedImage.getAttribute('srcset'), /\/fixture-image\.jpg\/m\/320x0\/.*320w/)
  assert.doesNotMatch(await list.locator('[data-story-results]').innerHTML(), /__LM_STORY_|__lm_story_image__/)
  await page.goto(`http://127.0.0.1:${server.address().port}/__story_links/index.html?search__text=rich`)
  const richLink = page.locator('[data-story-results] a.lm-rich-link')
  await richLink.waitFor({ state: 'visible' })
  assert.equal(await richLink.getAttribute('data-fixture-link'), 'override')
  assert.equal(await richLink.getAttribute('href'), '/de?from=list#details')
  assert.equal(await richLink.getAttribute('target'), '_blank')
  assert.equal(await richLink.locator('b').innerText(), 'Dynamic linked text')
  assert.equal(await richLink.locator('[data-rich-link-slot]').count(), 0)
  await page.goto(`http://127.0.0.1:${server.address().port}/__story_props/index.html`)
  const verifyProps = async () => {
   assert.equal(await page.locator('[data-story-list=custom-navigation-results] [data-story-results] [data-fixture-nav-item]').getAttribute('data-typography'), 'subtitle2')
   for (const [index, size] of [52, 20, 24, 24, 52, 56].entries()) {
    const avatar = page.locator(`[data-story-list="avatar-size-${index}"] [data-story-results] img`).first()
    assert.deepEqual(await avatar.evaluate(node => [getComputedStyle(node).width, getComputedStyle(node).height]), [`${size}px`, `${size}px`])
    assert.equal(await avatar.getAttribute('sizes'), `${size}px`)
    assert.match(await avatar.getAttribute('srcset'), new RegExp(`/m/${size}x0/`))
   }
   assert.equal(await page.locator('[data-story-list="description-limit-0"] [data-story-results] p').count(), 0)
   assert.equal(await page.locator('[data-story-list="description-limit-1"] [data-story-results] p').textContent(), '..')
  }
  await verifyProps()
  await page.evaluate(() => { const url = new URL(location.href); url.searchParams.set('search__text', 'image'); history.replaceState({}, '', url); document.dispatchEvent(new CustomEvent('lumen:search-change')) })
  await page.waitForFunction(() => [...document.querySelectorAll('[data-story-list]')].every(node => node.getAttribute('aria-busy') === 'false' && node.querySelector('[data-story-results]')?.textContent?.includes('image')))
  await verifyProps()
  for (const width of [375, 1280]) {
   await page.setViewportSize({ width, height: 812 })
   for (const language of ['en', 'de']) {
    await page.goto(`http://127.0.0.1:${server.address().port}/__travel_${language}/index.html`)
    const list = page.locator('[data-lm-travel-list]')
    await list.locator('[data-lm-list-item]:visible').first().waitFor()
    assert.equal(await list.locator('[data-lm-list-item]:visible').count(), 2)
    assert.equal(await list.locator('[data-travel-count]').textContent(), '2')
    const prefix = language === 'de' ? '/de/reisen/' : '/travels/'
    assert.equal(await list.locator('a').first().getAttribute('href'), `${prefix}trip-a`)
    await page.waitForFunction(expected => document.querySelector('[data-lm-travel-list] .lm-travel-list-price')?.textContent?.includes(expected), language === 'de' ? '1200 EUR' : '1500 USD')
    const search = page.locator('[data-lm-travel-search]')
    await page.waitForFunction(() => !document.querySelector('[data-lm-travel-search] select').disabled)
    assert.equal(categoryRequests.at(-1).searchParams.get('locale'), language)
    assert.equal(await search.locator('select[name=city] option').nth(2).textContent(), language === 'de' ? 'Stadt B [1]' : 'City B [1]')
    await search.locator('select[name=city]').selectOption('2')
    assert.equal(await list.locator('[data-lm-list-item]:visible').count(), 1)
    assert.equal(await list.locator('[data-lm-list-item]:visible').getAttribute('data-lm-list-item'), '43')
    assert.equal(await list.locator('[data-travel-count]').textContent(), '1')
    await search.locator('input').fill('no match')
    await page.waitForFunction(() => document.querySelector('[data-travel-count]').textContent === '0')
    assert.equal(await list.locator('[data-lm-list-item]:visible').count(), 0)
    await search.locator('input').fill('')
    await page.waitForFunction(() => document.querySelector('[data-travel-count]').textContent === '1')
    await search.locator('[data-clear=city]').click()
    assert.equal(await list.locator('[data-lm-list-item]:visible').count(), 2)
    categoryFail = true
    await search.locator('select[name=city]').selectOption('1')
    await search.locator('[data-travel-search-retry]').waitFor({ state: 'visible' })
    await search.locator('[data-travel-search-retry]').click()
    await search.locator('[data-travel-search-retry]').waitFor({ state: 'hidden' })
    await search.locator('[data-clear=city]').click()
    const detail = page.locator('#travel-detail')
    await detail.locator('[data-lm-swiper]').first().waitFor({ state: 'attached' })
    assert.equal(await detail.locator('h1').textContent(), 'Native travel fixture')
    const currency = language === 'de' ? '1200 EUR' : '1500 USD'
    await page.waitForFunction(value => document.querySelector('.lm-travel-price')?.textContent === value, currency)
    assert.match(await detail.innerText(), new RegExp(language === 'de' ? 'Stadt, Land' : 'City, Country'))
    assert.equal(await detail.locator('a[href*="signup?tid=42"]').getAttribute('href'), `https://admin.studentsgoabroad.com/signup?tid=42&lang=${language}`)
    assert.equal(await detail.locator('.lm-travel-team img').getAttribute('width'), '150')
    assert.ok(await detail.evaluate(node => node.scrollWidth <= node.clientWidth))
    for (const section of ['overview', 'description', 'accommodation', 'services', 'team']) assert.match(await detail.innerText(), new RegExp(`Travel ${section} fixture`))
   }
  }
  for (const width of [375, 768, 1280]) {
   await page.setViewportSize({ width, height: 812 })
   await page.goto(`http://127.0.0.1:${server.address().port}/__jobs/index.html`)
   const jobs = page.locator('[data-lm-auslandszeit]')
   const items = jobs.locator('[data-job-id]:visible')
   assert.equal(await items.count(), 3)
   const columns = await jobs.locator('.lm-jobs-grid').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length)
   assert.equal(columns, width < 600 ? 1 : width < 900 ? 2 : 3)
   assert.equal(await items.first().locator('a').getAttribute('href'), 'https://example.test/marine')
   assert.equal(await items.first().locator('a').getAttribute('target'), '_blank')
   assert.equal(await items.first().locator('a').getAttribute('rel'), 'noopener noreferrer')
   assert.equal(await items.first().locator('img').evaluate(node => node.getBoundingClientRect().height), 180)
   assert.match(await items.first().innerText(), /Start: June/)
   assert.match(await items.first().innerText(), /Dauer: 4 weeks/)
   assert.match(await items.first().innerText(), /Ort: Denpasar/)
   for (const query of ['MARINE', 'research', 'denpasar', 'indonesia', 'coral']) {
    await jobs.locator('input').fill(query)
    await page.waitForFunction(() => document.querySelectorAll('[data-job-id]:not([hidden])').length === 1)
    assert.equal(await items.first().getAttribute('data-job-id'), '1')
    await jobs.locator('[data-jobs-clear]').click()
    assert.equal(await items.count(), 3)
   }
   await jobs.locator('input').fill('no matching job')
   await page.waitForFunction(() => document.querySelectorAll('[data-job-id]:not([hidden])').length === 0)
   await jobs.locator('[data-jobs-clear]').click()
   await jobs.locator('input').fill('pending debounce')
   await jobs.locator('[data-jobs-clear]').click()
   await page.waitForTimeout(600)
   assert.equal(await items.count(), 3)
   assert.ok(await jobs.evaluate(node => node.scrollWidth <= node.clientWidth))
  }
  assert.deepEqual(errors, [])
  console.log('Story list: initial HTML, pagination, escaped content, truncation, numeric-zero hiding, avatar sizes, search reset, stale responses, empty state, retry and history navigation passed.')
 } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)) }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
