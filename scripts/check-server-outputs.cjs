// Compare emitted static HTML and search metadata without screenshots or baseline writes.
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const assert = require('node:assert/strict')
const { load } = require('cheerio')
const [baseline, candidate, reportPath] = process.argv.slice(2)
if (!baseline || !candidate)
  throw new Error(
    'Usage: node scripts/check-server-outputs.cjs <baseline consumers> <candidate consumers> [report.json]'
  )
const stable = (value) =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === 'object'
    ? Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => [key, stable(value[key])])
      )
    : value
const hash = (value) =>
  crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
const reports = {}
function readPages(root, site) {
  const dir = path.join(root, 'packages', site, '.next/server/pages')
  const pages = new Map()
  const walk = (folder) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (entry.name.endsWith('.html'))
        pages.set(path.relative(dir, file), file)
    }
  }
  walk(dir)
  assert(pages.size, `Missing HTML pages for ${site}`)
  return pages
}
function output(file) {
  const $ = load(fs.readFileSync(file, 'utf8'))
  const metadata = $(
    'head title, head meta:not([name="next-head-count"]), head link[rel="canonical"], head link[rel="alternate"]'
  )
    .toArray()
    .map((element) => ({
      tag: element.name,
      attrs: stable(element.attribs),
      text: $(element).text()
    }))
  const structuredData = $('script[type="application/ld+json"]')
    .toArray()
    .map((element) => stable(JSON.parse($(element).html())))
  // Bundle/build identifiers and serialized props have their own verification.
  $('script').remove()
  const body = $('body').html()
  return { metadata, structuredData, body }
}
for (const site of ['baliinternships', 'planet-training', 'upskill']) {
  const before = readPages(baseline, site),
    after = readPages(candidate, site)
  const missing = [...before.keys()].filter((key) => !after.has(key))
  const added = [...after.keys()].filter((key) => !before.has(key))
  const differences = []
  for (const [route, file] of before) {
    if (!after.has(route)) continue
    const a = output(file),
      b = output(after.get(route))
    const fields = Object.keys(a).filter((key) => hash(a[key]) !== hash(b[key]))
    if (fields.length) differences.push({ route, fields })
  }
  reports[site] = {
    pages: before.size,
    candidatePages: after.size,
    missing,
    added,
    differences
  }
}
const report = {
  comparedAt: new Date().toISOString(),
  baseline,
  candidate,
  checks: [
    'static body HTML excluding scripts',
    'title/meta/canonical/hreflang',
    'parsed JSON-LD'
  ],
  sites: reports
}
if (reportPath)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n')
for (const [site, result] of Object.entries(reports))
  console.log(
    `${site}: ${result.pages} pages, ${result.differences.length} differences, ${result.missing.length} missing, ${result.added.length} added`
  )
assert(
  Object.values(reports).every(
    (result) =>
      !result.differences.length &&
      !result.missing.length &&
      !result.added.length
  ),
  'Server outputs differ; inspect the report before accepting this candidate'
)
