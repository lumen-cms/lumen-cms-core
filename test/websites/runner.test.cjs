const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const sharp = require('sharp')
const {
  healthDifferences,
  compareCaptures,
  writeReport
} = require('../../scripts/website-results.cjs')
const sites = require('./sites.json')
const exec = promisify(execFile)
const root = path.resolve(__dirname, '../..')
function capture(side, extra = {}) {
  return {
    side,
    status: 200,
    url: `https://${side}.example/`,
    title: 'Page',
    fontStatus: 'loaded',
    fontFaces: [],
    pendingImages: [],
    headings: [{ text: 'Hello' }],
    overflow: 0,
    height: 8,
    errors: [],
    brokenImages: [],
    file: `${side}.png`,
    ...extra
  }
}
test('each site has 30 distinct routes and homepage plus localized coverage', () => {
  for (const profile of Object.values(sites)) {
    assert.equal(profile.routes.length, 30)
    assert.equal(new Set(profile.routes).size, 30)
    assert.equal(profile.routes[0], '/')
    assert(profile.routes.some((route) => route.startsWith('/de')))
    for (const route of profile.routes) {
      const url = new URL(route, profile.origin)
      assert.equal(url.origin, profile.origin)
      assert.equal(url.search, '')
    }
  }
})
test('matching HTTP failures cannot pass', () => {
  assert.equal(
    healthDifferences(
      capture('local', { status: 404 }),
      capture('live', { status: 404 })
    ).length,
    2
  )
})
test('new hydration errors, overflow, headings, redirects and broken images fail independently of pixel tolerance', () => {
  const local = capture('local', {
    errors: ['Hydration failed'],
    overflow: 20,
    headings: [{ text: 'Wrong site' }],
    url: 'https://local.example/wrong',
    brokenImages: [{ src: '/broken.png' }]
  })
  assert.equal(healthDifferences(local, capture('live')).length, 5)
})
test('pre-existing live errors remain distinguishable from new errors', () => {
  const issues = {
    errors: ['Existing error'],
    brokenImages: [{ src: '/old.png' }]
  }
  assert.deepEqual(
    healthDifferences(capture('local', issues), capture('live', issues)),
    []
  )
})
test('incomplete fonts and images cannot pass', () => {
  assert.equal(
    healthDifferences(
      capture('local', { fontStatus: 'loading', pendingImages: [{}] }),
      capture('live')
    ).length,
    2
  )
})
test('new accordion heading wrappers do not fail otherwise matching main headings', () => {
  const main = { level: 'H1', text: 'FAQ' }
  assert.deepEqual(
    healthDifferences(
      capture('local', { headings: [main, { level: 'H3', text: 'Question' }] }),
      capture('live', { headings: [main] })
    ),
    []
  )
})
test('pixel comparisons create evidence and never ignore changed dimensions', async (t) => {
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'website-results-'))
  t.after(() => fs.rm(output, { recursive: true, force: true }))
  const write = (file, height, background) =>
    sharp({ create: { width: 8, height, channels: 4, background } })
      .png()
      .toFile(path.join(output, file))
  await write('live.png', 8, '#ffffff')
  await write('local.png', 8, '#ffffff')
  assert.equal(
    (await compareCaptures(capture('local'), capture('live'), output, 'same'))
      .status,
    'passed'
  )
  await write('local.png', 8, '#000000')
  const changed = await compareCaptures(
    capture('local'),
    capture('live'),
    output,
    'changed'
  )
  assert.equal(changed.status, 'failed')
  assert.equal(changed.changedPercent, 100)
  await fs.access(path.join(output, 'changed-diff.png'))
  await write('local.png', 9, '#ffffff')
  const resized = await compareCaptures(
    capture('local'),
    capture('live'),
    output,
    'resized',
    100
  )
  assert.equal(resized.status, 'failed')
  assert(resized.reasons.includes('Screenshot dimensions differ'))
  const summary = await writeReport(
    output,
    [{ ...changed, key: 'changed', path: '/<script>', width: 1280 }],
    { candidate: 'fixture', browser: 'fixture' }
  )
  assert.equal(summary.failed, 1)
  assert(
    (await fs.readFile(path.join(output, 'report.html'), 'utf8')).includes(
      '/&lt;script&gt;'
    )
  )
})
test('CLI rejects invalid inputs before doing any build or network work', async () => {
  for (const args of [
    ['bali', '--limit', '0'],
    ['bali', '--widths', '1280,1280'],
    ['planet', '--base-url', 'https://planet.training'],
    ['unknown']
  ]) {
    await assert.rejects(
      exec(process.execPath, ['scripts/test-website.cjs', ...args], {
        cwd: root
      })
    )
  }
  const { stdout } = await exec(
    process.execPath,
    ['scripts/test-website.cjs', 'upskill', '--list'],
    { cwd: root }
  )
  assert.equal(JSON.parse(stdout).comparisons, 60)
})
