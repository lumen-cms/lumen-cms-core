// Run each reference website with isolated Next build output; never rewrite .env.
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const dotenv = require('dotenv')
const root = path.resolve(__dirname, '..')
const [action, site, ...flags] = process.argv.slice(2)
const profiles = {
  bali: { key: 'BALI', port: 3009 },
  planet: { key: 'PLANET', port: 3010 },
  upskill: { key: 'UPSKILL', port: 3011 }
}
if (
  !['dev', 'build', 'start'].includes(action) ||
  !profiles[site] ||
  flags.some((flag) => flag !== '--smoke') ||
  (flags.includes('--smoke') && action !== 'build')
) {
  console.error(
    'Usage: yarn reference:site <dev|build|start> <bali|planet|upskill> [--smoke (build only)]'
  )
  process.exit(1)
}
const readEnv = (name) =>
  fs.existsSync(path.join(root, name))
    ? dotenv.parse(fs.readFileSync(path.join(root, name)))
    : {}
const base = { ...readEnv('.env'), ...readEnv('.env.local'), ...process.env }
const credentials = { ...readEnv('.env.reference.local'), ...process.env }
const profile = profiles[site]
const previewToken =
  credentials[`REFERENCE_${profile.key}_PREVIEW_TOKEN`] ||
  (site === 'bali' ? base.NEXT_PUBLIC_PREVIEW_TOKEN : undefined)
const publicToken =
  credentials[`REFERENCE_${profile.key}_PUBLIC_TOKEN`] ||
  (site === 'bali' ? base.NEXT_PUBLIC_PUBLIC_TOKEN : undefined)
if (!previewToken || !publicToken) {
  console.error(
    `Set REFERENCE_${profile.key}_PREVIEW_TOKEN and REFERENCE_${profile.key}_PUBLIC_TOKEN in .env.reference.local`
  )
  process.exit(1)
}
const env = {
  ...base,
  NEXT_PUBLIC_PREVIEW_TOKEN: previewToken,
  NEXT_PUBLIC_PUBLIC_TOKEN: publicToken,
  NEXT_DIST_DIR: `.next-reference/${site}`
}
if (flags.includes('--smoke')) env.TEST = 'TRUE'
else delete env.TEST
if (action === 'build') {
  const compilerPackage = require.resolve('@typescript/native/package.json')
  const compiler = path.resolve(
    path.dirname(compilerPackage),
    require(compilerPackage).bin.tsc
  )
  const check = spawnSync(process.execPath, [compiler, '--noEmit'], {
    cwd: root,
    env,
    stdio: 'inherit'
  })
  if (check.status !== 0) process.exit(check.status ?? 1)
}
const args =
  action === 'build'
    ? ['build', '--webpack']
    : [
        action,
        ...(action === 'dev' ? ['--webpack'] : []),
        '-p',
        String(profile.port),
        '--hostname',
        '127.0.0.1'
      ]
console.log(
  `Reference site: ${site}; ${action}; ${env.NEXT_DIST_DIR}${
    action === 'build' ? '' : `; http://127.0.0.1:${profile.port}`
  }`
)
const result = spawnSync(
  process.execPath,
  [require.resolve('next/dist/bin/next'), ...args],
  { cwd: root, env, stdio: 'inherit' }
)
if (result.error) console.error(result.error.message)
process.exit(result.status ?? 1)
