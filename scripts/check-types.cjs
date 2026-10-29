// Avoid depending on which TypeScript package last linked the `tsc` binary.
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const manifest = require.resolve('@typescript/native/package.json')
const compiler = path.resolve(path.dirname(manifest), require(manifest).bin.tsc)
const result = spawnSync(
  process.execPath,
  [compiler, '--noEmit', ...process.argv.slice(2)],
  {
    stdio: 'inherit'
  }
)
if (result.error) throw result.error
process.exitCode = result.status ?? 1
