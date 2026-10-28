// Compare pre/post Next builds offline. This command never records/accepts a baseline.
const { spawnSync } = require('node:child_process')
const { resolve } = require('node:path')
const [baseline, candidate, report] = process.argv.slice(2)
if (!baseline || !candidate)
  throw new Error(
    'Usage: yarn test:page-data <baseline consumer root> <candidate consumer root> [report.json]'
  )
const result = spawnSync(
  'yarn',
  [
    'vitest',
    'run',
    '--project',
    'integration',
    'src/utils/initial-props/serverPageData.integration.test.ts'
  ],
  {
    cwd: resolve(__dirname, '..'),
    stdio: 'inherit',
    env: {
      ...process.env,
      PAGE_DATA_BASELINE: resolve(baseline),
      PAGE_DATA_CANDIDATE: resolve(candidate),
      ...(report ? { PAGE_DATA_REPORT: resolve(report) } : {})
    }
  }
)
if (result.error) throw result.error
process.exitCode = result.status ?? 1
