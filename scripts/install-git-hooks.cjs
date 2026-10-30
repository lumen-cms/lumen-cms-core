const { existsSync, chmodSync } = require('node:fs')
const { resolve } = require('node:path')
const { execFileSync } = require('node:child_process')

const root = resolve(__dirname, '..')

// Install only in a source checkout, never in a consumer's node_modules.
if (existsSync(resolve(root, '.git'))) {
  let hooksPath
  try {
    hooksPath = execFileSync('git', ['config', '--get', 'core.hooksPath'], {
      cwd: root,
      encoding: 'utf8'
    }).trim()
  } catch (error) {
    if (error.status !== 1) throw error
  }

  if (hooksPath && hooksPath !== '.githooks') {
    throw new Error(
      `Existing core.hooksPath=${hooksPath}; integrate .githooks/pre-push before replacing it.`
    )
  }

  chmodSync(resolve(root, '.githooks/pre-push'), 0o755)
  execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], {
    cwd: root,
    stdio: 'inherit'
  })
}
