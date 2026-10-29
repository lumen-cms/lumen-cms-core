// Guard the core/package boundary. Wallet CMS schema names may remain in the
// generated schema, but wallet implementations and dependencies may not.
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const assert = require('node:assert/strict')
const root = path.resolve(__dirname, '..')
const manifest = require('../package.json')
const walletPackage =
  /^(?:lumen-cms-web3|ethers|@ethersproject\/|@walletconnect\/|@web3-react\/|@metamask\/)/
for (const section of [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]) {
  for (const name of Object.keys(manifest[section] || {})) {
    assert(!walletPackage.test(name), `${section} must not include ${name}`)
  }
}
const lock = fs.readFileSync(path.join(root, 'pnpm-lock.yaml'), 'utf8')
assert(
  !/^\s*['"]?(?:ethers@|@ethersproject\/|@walletconnect\/|@web3-react\/|@metamask\/|lumen-cms-web3@)/m.test(
    lock
  ),
  'Wallet packages remain in the core lockfile'
)
for (const oldPath of [
  'src/components/web3',
  'src/utils/web3',
  'src/pages/api/sign/message.ts',
  'src/stories/Web3.story.tsx'
]) {
  assert(
    !fs.existsSync(path.join(root, oldPath)),
    `Legacy wallet source remains: ${oldPath}`
  )
}
assert(
  !fs
    .readFileSync(path.join(root, 'src/utils/config.ts'), 'utf8')
    .includes('web3MintFunction'),
  'Wallet configuration remains in core'
)
const archive = process.argv[2]
if (archive) {
  const entries = execFileSync('tar', ['-tzf', path.resolve(archive)], {
    encoding: 'utf8'
  }).split('\n')
  assert(
    !entries.some((file) =>
      /(?:components\/web3\/|utils\/web3\/|pages\/api\/sign\/|stories\/Web3\.)/.test(
        file
      )
    ),
    'Wallet implementation was packed into core'
  )
}
console.log(
  'Core wallet boundary passed: manifest, lockfile, source paths, configuration' +
    (archive ? ', and packed files.' : '.')
)
