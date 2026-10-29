// Prepare isolated copies of the real website consumers for package verification.
// Originals are read only; credentials stay local and are never printed.
const fs = require('node:fs')
const path = require('node:path')
const [sourceArg, targetArg, archiveArg, siteArg] = process.argv.slice(2)
if (!sourceArg || !targetArg || !archiveArg) {
  throw new Error(
    'Usage: node scripts/prepare-consumer-verification.cjs <websites repo> <new output directory> <candidate.tgz> [consumer directory name]'
  )
}
const source = fs.realpathSync(sourceArg)
const target = path.resolve(targetArg)
const archive = fs.realpathSync(archiveArg)
if (fs.existsSync(target)) throw new Error('Output directory must not exist')
const allSites = fs
  .readdirSync(path.join(source, 'packages'))
  .filter((site) =>
    fs.existsSync(path.join(source, 'packages', site, 'package.json'))
  )
if (siteArg && !allSites.includes(siteArg)) throw new Error('Unknown consumer')
const sites = siteArg ? [siteArg] : allSites
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
  packageManager: core.packageManager,
  workspaces: sites.map((site) => `packages/${site}`)
})
// Overrides belong to the consumer workspace, not the installed package.
const workspace = fs.readFileSync(
  path.join(__dirname, '../pnpm-workspace.yaml'),
  'utf8'
)
fs.writeFileSync(
  path.join(target, 'pnpm-workspace.yaml'),
  workspace.replace(
    '  - .\n',
    sites.map((site) => `  - packages/${site}\n`).join('')
  )
)
for (const name of ['tsconfig.base.json', 'scripts/check-types.cjs']) {
  const original = path.join(source, name)
  if (fs.existsSync(original)) {
    fs.mkdirSync(path.dirname(path.join(target, name)), { recursive: true })
    fs.copyFileSync(original, path.join(target, name))
  }
}
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
    .filter((name) => name.startsWith('.env'))) {
    const envPath = path.join(to, name)
    const { migrateConsumerEnv } = require('./consumer-env.cjs')
    fs.writeFileSync(
      envPath,
      migrateConsumerEnv(fs.readFileSync(envPath, 'utf8')),
      { mode: 0o600 }
    )
    fs.chmodSync(envPath, 0o600)
  }
  const manifestPath = path.join(to, 'package.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  Object.assign(manifest.dependencies, {
    'lumen-cms-core': 'file:../../candidate.tgz',
    next: core.devDependencies.next,
    react: core.devDependencies.react,
    'react-dom': core.devDependencies['react-dom']
  })
  Object.assign(manifest.devDependencies, {
    typescript: core.devDependencies.typescript,
    '@typescript/native': core.devDependencies['@typescript/native'],
    '@types/node': core.devDependencies['@types/node'],
    '@types/react': core.dependencies['@types/react'],
    '@types/react-dom': core.dependencies['@types/react-dom']
  })
  manifest.engines = core.engines
  Object.assign(manifest.scripts, {
    dev: 'next dev',
    build: 'pnpm run check-types && next build',
    'check-types': fs.existsSync(path.join(target, 'scripts/check-types.cjs'))
      ? 'node ../../scripts/check-types.cjs --incremental false'
      : 'node check-types.cjs --incremental false'
  })
  fs.copyFileSync(
    path.join(__dirname, 'check-types.cjs'),
    path.join(to, 'check-types.cjs')
  )
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
  ts.compilerOptions ||= {}
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
  delete ts.compilerOptions.paths
  ts.include = [
    'next-env.d.ts',
    'src/**/*.ts',
    'src/**/*.tsx',
    '.next/types/**/*.ts',
    '.next/dev/types/**/*.ts'
  ]
  writeJson(tsPath, ts)
}
console.log(
  `Prepared ${sites.length} consumers in ${target}; source checkout unchanged.`
)
