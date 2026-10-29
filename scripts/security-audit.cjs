// Keep every advisory visible; do not silently allowlist the legacy integrations.
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')
const result = spawnSync(
  'pnpm',
  ['audit', '--json'],
  {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  }
)
if (result.error) throw result.error
let audit
try {
  audit = JSON.parse(result.stdout)
  if (!audit.advisories || !audit.metadata)
    throw new Error('Missing audit data')
} catch {
  console.error('Security audit failed; no valid registry report was returned.')
  process.exit(2)
}
const advisories = Object.values(audit.advisories).map((entry) => ({
  id: entry.github_advisory_id,
  module: entry.module_name,
  severity: entry.severity,
  title: entry.title,
  url: entry.url,
  patchedVersions: entry.patched_versions,
  // Registry paths can overattribute different installed versions of a package.
  // Verify a specific chain with `pnpm why <module>` before judging exposure.
  findings: entry.findings
}))
const counts = Object.fromEntries(
  ['critical', 'high', 'moderate', 'low', 'info'].map((severity) => [
    severity,
    advisories.filter((entry) => entry.severity === severity).length
  ])
)
const report = {
  checkedAt: new Date().toISOString(),
  command: 'pnpm audit --json',
  scope:
    'Root package and transitive dependencies, including development dependencies; excludes legacy base/',
  counts,
  distinctAdvisories: advisories.length,
  advisories
}
if (process.argv[2]) {
  fs.writeFileSync(
    path.resolve(process.argv[2]),
    JSON.stringify(report, null, 2) + '\n'
  )
}
console.log(
  JSON.stringify({ distinctAdvisories: advisories.length, counts }, null, 2)
)
for (const module of [
  ...new Set(advisories.map((entry) => entry.module))
].sort()) {
  const entries = advisories.filter((entry) => entry.module === module)
  console.log(
    `${module}: ${entries.length} advisories (${[
      ...new Set(entries.map((entry) => entry.severity))
    ].join(', ')})`
  )
}
process.exitCode = counts.critical || counts.high ? 1 : 0
