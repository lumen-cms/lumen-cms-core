const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const sharp = require('sharp')
const { matchReviewedRegions } = require('../../scripts/website-dynamics.cjs')
const {
  compareCaptures,
  writeReport
} = require('../../scripts/website-results.cjs')
const region = {
  id: 'fixture-announcement',
  kind: 'rotating-announcement',
  signature: 'same deck and typography',
  rect: { x: 0, y: 0, width: 4, height: 4 },
  reason: 'Fixture dynamic content'
}
const capture = (side, extra = {}) => ({
  side,
  status: 200,
  url: `https://${side}.example/`,
  title: 'Page',
  fontStatus: 'loaded',
  fontFaces: [],
  pendingImages: [],
  headings: [],
  overflow: 0,
  height: 8,
  errors: [],
  brokenImages: [],
  file: `${side}.png`,
  reviewedRegions: [region],
  ...extra
})

test('reviewed dynamic regions require matching content, styling, and geometry', () => {
  assert.equal(matchReviewedRegions([region], [region]).regions.length, 1)
  for (const change of [
    { signature: 'different font' },
    { rect: { ...region.rect, height: 0 } }
  ]) {
    const result = matchReviewedRegions([region], [{ ...region, ...change }])
    assert.equal(result.regions.length, 0)
    assert.equal(result.issues.length, 1)
  }
  assert.equal(matchReviewedRegions([region], []).regions.length, 0)
})
test('a delayed known fixed chat overlay may be absent on one side', () => {
  assert.equal(
    matchReviewedRegions([{ ...region, optionalOverlay: true }], []).regions
      .length,
    1
  )
})
test('dynamic pixels do not hide static changes, HTTP errors, or collapsed geometry', async (t) => {
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'website-dynamic-'))
  t.after(() => fs.rm(output, { recursive: true, force: true }))
  const image = async (file, blackAt) => {
    const data = Buffer.alloc(8 * 8 * 3, 255)
    for (const [x, y] of blackAt)
      data.fill(0, (y * 8 + x) * 3, (y * 8 + x) * 3 + 3)
    await sharp(data, { raw: { width: 8, height: 8, channels: 3 } })
      .png()
      .toFile(path.join(output, file))
  }
  await image('live.png', [])
  await image('local.png', [[1, 1]])
  const dynamic = await compareCaptures(
    capture('local'),
    capture('live'),
    output,
    'dynamic'
  )
  assert.equal(dynamic.status, 'dynamic-only')
  assert.equal(dynamic.staticChangedPercent, 0)
  assert.equal(dynamic.dynamicPixels, 1)
  assert.equal(
    (
      await compareCaptures(
        capture('local', { status: 500 }),
        capture('live'),
        output,
        'error'
      )
    ).status,
    'failed'
  )
  await image('local.png', [
    [1, 1],
    [7, 7]
  ])
  assert.equal(
    (await compareCaptures(capture('local'), capture('live'), output, 'static'))
      .status,
    'failed'
  )
  const collapse = await compareCaptures(
    capture('local', {
      reviewedRegions: [{ ...region, rect: { ...region.rect, height: 0 } }]
    }),
    capture('live'),
    output,
    'collapsed'
  )
  assert.equal(collapse.status, 'failed')
  const summary = await writeReport(
    output,
    [{ ...dynamic, key: 'dynamic', path: '/', width: 8 }],
    { candidate: 'fixture', browser: 'fixture' }
  )
  assert.equal(summary.dynamicOnly, 1)
  assert.equal(summary.failed, 0)
})
