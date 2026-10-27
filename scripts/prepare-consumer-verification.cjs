// Prepare isolated copies of the real website consumers for package verification.
// Originals are read only; credentials stay local and are never printed.
const fs = require('node:fs')
const path = require('node:path')
const [sourceArg, targetArg, archiveArg] = process.argv.slice(2)
if (!sourceArg || !targetArg || !archiveArg) {
  throw new Error(
    'Usage: node scripts/prepare-consumer-verification.cjs <websites repo> <new output directory> <candidate.tgz>'
  )
}
const source = fs.realpathSync(sourceArg)
const target = path.resolve(targetArg)
const archive = fs.realpathSync(archiveArg)
if (fs.existsSync(target)) throw new Error('Output directory must not exist')
const sites = ['baliinternships', 'planet-training', 'upskill']
const core = require('../package.json')
const writeJson = (file, value) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
for (const site of sites) {
  if (!fs.existsSync(path.join(source, 'packages', site, 'package.json'))) {
    throw new Error(`Missing consumer: ${site}`)
  }
}
fs.mkdirSync(target, { recursive: true, mode: 0o700 })
fs.copyFileSync(archive, path.join(target, 'candidate.tgz'))
writeJson(path.join(target, 'package.json'), {
  name: 'lumen-consumer-verification',
  private: true,
  packageManager: 'yarn@4.6.0',
  workspaces: sites.map((site) => `packages/${site}`)
})
fs.mkdirSync(path.join(target, '.yarn/releases'), { recursive: true })
fs.copyFileSync(
  path.join(source, '.yarn/releases/yarn-4.6.0.cjs'),
  path.join(target, '.yarn/releases/yarn-4.6.0.cjs')
)
fs.writeFileSync(
  path.join(target, '.yarnrc.yml'),
  'nodeLinker: node-modules\nenableGlobalCache: false\nyarnPath: .yarn/releases/yarn-4.6.0.cjs\n'
)
fs.copyFileSync(path.join(source, 'yarn.lock'), path.join(target, 'yarn.lock'))
for (const site of sites) {
  const from = path.join(source, 'packages', site)
  const to = path.join(target, 'packages', site)
  fs.cpSync(from, to, {
    recursive: true,
    filter: (file) => {
      const name = path.basename(file)
      return (
        ![
          'node_modules',
          '.git',
          '.next',
          '.turbo',
          '.vercel',
          'dist'
        ].includes(name) && !name.endsWith('.tsbuildinfo')
      )
    }
  })
  for (const name of fs
    .readdirSync(to)
    .filter((name) => name.startsWith('.env')))
    fs.chmodSync(path.join(to, name), 0o600)
  const manifestPath = path.join(to, 'package.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  Object.assign(manifest.dependencies, {
    'lumen-cms-core': 'file:../../candidate.tgz',
    next: core.devDependencies.next,
    react: core.devDependencies.react,
    'react-dom': core.devDependencies['react-dom']
  })
  Object.assign(manifest.devDependencies, {
    // Yarn 4's built-in patch crashes on the TypeScript 6 compatibility alias.
    // Pin the underlying JS compiler API directly; run the TS7 binary explicitly.
    typescript: '6.0.3',
    '@typescript/native': core.devDependencies['@typescript/native'],
    '@types/node': core.devDependencies['@types/node']
  })
  manifest.engines = core.engines
  Object.assign(manifest.scripts, {
    dev: 'next dev --webpack',
    // Candidate archives can share a package version. Webpack otherwise reuses
    // immutable node_modules snapshots from the preceding candidate.
    build:
      'yarn check-types && node -e "require(\'node:fs\').rmSync(\'.next/cache\', { recursive: true, force: true })" && next build --webpack',
    'check-types':
      'node ../../node_modules/@typescript/native/bin/tsc --project tsconfig.json --noEmit --incremental false'
  })
  writeJson(manifestPath, manifest)
  const configPath = path.join(to, 'next.config.js')
  let config = fs.readFileSync(configPath, 'utf8')
  config = config
    .replace(/experimental:\s*\{\s*(outputFileTracingRoot:[^\n]+)\s*\},?/, '$1')
    .replace(/eslint:\s*\{\s*ignoreDuringBuilds:\s*true,?\s*\},?/, '')
    .replace(/typescript:\s*\{\s*ignoreBuildErrors:\s*true\s*\},?/, '')
  fs.writeFileSync(configPath, config)
  if (site === 'planet-training') {
    // Next 16 rejects this legacy relative target. Preserve the live URL;
    // selecting a replacement for its existing 404 is a separate CMS decision.
    const redirectsPath = path.join(to, 'redirects.js')
    const redirects = fs.readFileSync(redirectsPath, 'utf8')
    fs.writeFileSync(
      redirectsPath,
      redirects.replace(
        'destination: "dealing -failure"',
        'destination: "/dealing%20-failure"'
      )
    )
  }
  const tsPath = path.join(to, 'tsconfig.json')
  const ts = JSON.parse(fs.readFileSync(tsPath, 'utf8'))
  Object.assign(ts.compilerOptions, {
    target: 'ESNext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    noEmit: true,
    allowJs: true
  })
  delete ts.compilerOptions.baseUrl
  delete ts.compilerOptions.downlevelIteration
  delete ts.compilerOptions.suppressImplicitAnyIndexErrors
  for (const key of Object.keys(ts.compilerOptions.paths)) {
    ts.compilerOptions.paths[key] = ts.compilerOptions.paths[key].map((p) =>
      p.startsWith('.') ? p : `./${p}`
    )
  }
  ts.include = ts.include.map((p) => (p === 'next-env' ? 'next-env.d.ts' : p))
  writeJson(tsPath, ts)
}
console.log(
  `Prepared ${sites.length} consumers in ${target}; source checkout unchanged.`
)
