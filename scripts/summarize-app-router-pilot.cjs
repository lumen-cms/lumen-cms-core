// Summarize an actual completed run; never substitute estimated performance.
// node scripts/summarize-app-router-pilot.cjs [output.json]
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')

const repo = path.resolve(__dirname, '..')
const work = path.join(repo, '.next-reference/app-router-pilot')
const report = JSON.parse(
  fs.readFileSync(path.join(work, 'results/report.json'))
)
const sha256 = (data) => createHash('sha256').update(data).digest('hex')
const round = (number) => Math.round(number * 100) / 100
const stats = (values) => {
  const sorted = values.toSorted((a, b) => a - b)
  assert.ok(sorted.every(Number.isFinite), 'Missing performance metric')
  const mid = Math.floor(sorted.length / 2)
  return {
    median: round(
      sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
    ),
    min: round(sorted[0]),
    max: round(sorted.at(-1))
  }
}
const metrics = [
  'responseStartMs',
  'fcpMs',
  'lcpMs',
  'hydrationEffectMs',
  'totalBlockingMs',
  'scriptDurationMs',
  'taskDurationMs',
  'searchOpenMs'
]
const routes = [...new Set(report.artifactSizes.map((item) => item.route))]
const comparisons = []
for (const route of routes)
  for (const profile of report.profiles) {
    const pair = {}
    for (const mode of ['pages', 'app']) {
      const samples = report.samples.filter(
        (item) =>
          item.route === route &&
          item.profile === profile.name &&
          item.mode === mode
      )
      assert.equal(
        samples.length,
        report.runs,
        `Incomplete run: ${mode} ${route} ${profile.name}`
      )
      pair[mode] = {
        samples: samples.length,
        timing: Object.fromEntries(
          metrics.map((metric) => [
            metric,
            stats(samples.map((item) => item[metric]))
          ])
        ),
        loadedJavaScriptGzipBytes: stats(
          samples.map((item) => item.javascript.bytes.gzip)
        ),
        loadedJavaScriptRequests: stats(
          samples.map((item) => item.javascript.files)
        )
      }
    }
    const deltaPercent = Object.fromEntries(
      metrics.map((metric) => [
        metric,
        pair.pages.timing[metric].median === 0
          ? pair.app.timing[metric].median === 0
            ? 0
            : null
          : round(
              (pair.app.timing[metric].median /
                pair.pages.timing[metric].median -
                1) *
                100
            )
      ])
    )
    comparisons.push({ route, profile: profile.name, ...pair, deltaPercent })
  }

const summary = {
  measuredAt: report.measuredAt,
  versions: {
    next: report.nextVersion,
    react: require('react/package.json').version,
    mui: require('@mui/material/package.json').version,
    node: process.version
  },
  method: report.method,
  profiles: report.profiles,
  runsPerModeRouteProfile: report.runs,
  publicSnapshots: JSON.parse(
    fs.readFileSync(path.join(work, 'snapshot/manifest.json'))
  ).map((entry) => ({
    ...entry,
    sha256: sha256(fs.readFileSync(path.join(work, 'snapshot', entry.file)))
  })),
  artifactSizes: report.artifactSizes,
  staticContract: report.staticContract,
  staticVerifiedAt: report.staticVerifiedAt || report.measuredAt,
  noJavaScript: report.noJavaScript,
  liveGeneration: fs.existsSync(path.join(work, 'results/live-check.json'))
    ? JSON.parse(fs.readFileSync(path.join(work, 'results/live-check.json')))
    : null,
  parity: report.visual.map((item) => ({
    route: item.route,
    profile: item.profile,
    sameContent: item.sameContent,
    sameHeadings: item.sameHeadings,
    pixels: item.pixels,
    mainTextHash: sha256(item.app.state.mainText),
    metadata: Object.fromEntries(
      [
        'title',
        'description',
        'canonical',
        'robots',
        'jsonLd',
        'language',
        'alternates'
      ].map((key) => [key, item.app.state[key]])
    ),
    browserErrors: { pages: item.pages.errors, app: item.app.errors },
    consoleWarnings: {
      pages: [...new Set(item.pages.warnings)],
      app: [...new Set(item.app.warnings)]
    },
    failedResponses: {
      pages: [...new Set(item.pages.failedResponses || [])],
      app: [...new Set(item.app.failedResponses || [])]
    },
    interactions: {
      pages: { drawer: item.pages.drawer, navigation: item.pages.navigation },
      app: { drawer: item.app.drawer, navigation: item.app.navigation }
    },
    screenshots: { pages: item.pages.screenshot, app: item.app.screenshot }
  })),
  externalAssetFailures: report.externalAssetFailures,
  comparisons,
  rawReport: '.next-reference/app-router-pilot/results/report.json'
}
const output = process.argv[2] || path.join(work, 'results/summary.json')
fs.writeFileSync(output, JSON.stringify(summary, null, 2) + '\n')
console.log(output)
