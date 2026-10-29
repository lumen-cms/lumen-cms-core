const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  collectSearchRegions,
  matchSearchRegions
} = require('../../scripts/website-expected-changes.cjs')
const region = {
  id: 'list_search_autocomplete:["","Search...","input"]',
  kind: 'expected-component-change',
  signature: '["","Search...","input"]',
  version: 'inline-autocomplete',
  rect: { x: 10, y: 10, width: 180, height: 40 }
}
const candidate = {
  ...region,
  version: 'command-palette-v1',
  rect: { ...region.rect, width: 220 }
}

test('approved search migration masks only paired controls and expires once live migrates', () => {
  assert.equal(matchSearchRegions([candidate], [region]).regions.length, 2)
  assert.equal(matchSearchRegions([candidate], [candidate]).regions.length, 0)
  assert.equal(matchSearchRegions([region], [region]).regions.length, 0)
  assert.equal(matchSearchRegions([candidate], []).issues.length, 1)
  assert.equal(matchSearchRegions([], [region]).regions.length, 0)
  for (const change of [
    { rect: { ...candidate.rect, height: 0 } },
    { rect: { ...candidate.rect, height: 80 } },
    { rect: { ...candidate.rect, y: 40 } },
    { rect: { ...candidate.rect, width: 500 } },
    { id: 'changed-label' }
  ]) {
    const result = matchSearchRegions([{ ...candidate, ...change }], [region])
    assert.equal(result.regions.length, 0)
    assert(result.issues.length)
  }
  assert.equal(
    matchSearchRegions([candidate, candidate], [region, region]).regions.length,
    0
  )
})

test('browser identifies only CMS-proven legacy search and explicit new openers on any site', async (t) => {
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const page = await browser.newPage()
  const legacy = (placeholder) =>
    `<div class="MuiAutocomplete-root"><span class="MuiInputAdornment-positionStart"><svg class="MuiSvgIcon-root"></svg></span><input role="combobox" aria-autocomplete="both" placeholder="${placeholder}"></div>`
  await page.setContent(`<script id="__NEXT_DATA__" type="application/json">{"props":{"content":{"component":"list_search_autocomplete","placeholder":"Search..."}}}</script>
    ${legacy('Search...')}${legacy('Country')}
    <button data-lm-search-version="command-palette-v1" data-lm-search-placeholder="Search..." data-lm-search-mode="input" aria-haspopup="dialog">Search...</button>
    <button aria-haspopup="dialog">Unrelated dialog</button>`)
  const regions = await page.evaluate(collectSearchRegions)
  assert.equal(regions.length, 2)
  assert.equal(regions[0].id, regions[1].id)
  await page.locator('#__NEXT_DATA__').evaluate((el) => el.remove())
  assert.equal((await page.evaluate(collectSearchRegions)).length, 1)
  await page.setContent(`<script id="__NEXT_DATA__" type="application/json">{"component":"list_search_autocomplete","placeholder":"Search..."}</script>
    <button class="MuiIconButton-root">Search</button><div class="MuiBox-root" style="display:none">${legacy(
      'Search...'
    )}</div>`)
  const mobile = await page.evaluate(collectSearchRegions)
  assert.equal(mobile.length, 1)
  assert.equal(mobile[0].signature, '["","Search...","icon"]')
})

test('approved search pixels are reported and cannot hide surrounding changes or HTTP errors', async (t) => {
  const fs = require('node:fs/promises'),
    os = require('node:os'),
    path = require('node:path')
  const sharp = require('sharp')
  const { compareCaptures } = require('../../scripts/website-results.cjs')
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'search-change-'))
  t.after(() => fs.rm(output, { recursive: true, force: true }))
  const rect = { x: 0, y: 0, width: 4, height: 4 }
  const capture = (side, version) => ({
    side,
    file: `${side}.png`,
    status: 200,
    url: `https://${side}.test/`,
    title: 'Page',
    headings: [],
    fontStatus: 'loaded',
    fontFaces: [],
    pendingImages: [],
    errors: [],
    brokenImages: [],
    overflow: 0,
    expectedSearchRegions: [{ ...region, rect, version }]
  })
  const local = capture('local', 'command-palette-v1'),
    live = capture('live', 'inline-autocomplete')
  const write = async (file, points) => {
    const data = Buffer.alloc(8 * 8 * 3, 255)
    for (const [x, y] of points)
      data.fill(0, (y * 8 + x) * 3, (y * 8 + x) * 3 + 3)
    await sharp(data, { raw: { width: 8, height: 8, channels: 3 } })
      .png()
      .toFile(path.join(output, file))
  }
  await write('live.png', [])
  await write('local.png', [[1, 1]])
  const accepted = await compareCaptures(local, live, output, 'accepted')
  assert.equal(accepted.status, 'dynamic-only')
  assert.equal(accepted.expectedChangePixels, 1)
  assert.equal(accepted.expectedChanges.length, 2)
  assert.equal(
    (await compareCaptures({ ...local, status: 500 }, live, output, 'error'))
      .status,
    'failed'
  )
  await write('local.png', [
    [1, 1],
    [7, 7]
  ])
  assert.equal(
    (await compareCaptures(local, live, output, 'outside')).status,
    'failed'
  )
})
