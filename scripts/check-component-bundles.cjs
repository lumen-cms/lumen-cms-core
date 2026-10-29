// Compare isolated production consumers prepared with prepare-component-bundle-fixtures.
// Module membership is checked independently of byte counts: shared dependencies
// may remain shared, but unrelated block implementations must not be downloaded.
const fs = require('node:fs')
const path = require('node:path')
const { gzipSync } = require('node:zlib')
const assert = require('node:assert/strict')

const [baseline, candidate, output] = process.argv.slice(2)
if (!baseline || !candidate)
  throw new Error(
    'Usage: node scripts/check-component-bundles.cjs <baseline consumer root> <candidate consumer root> [report.json]'
  )
const sites = ['baliinternships', 'planet-training', 'upskill']

function inspect(root, site) {
  const build = path.join(root, 'packages', site, '.next')
  const manifest = JSON.parse(
    fs.readFileSync(path.join(build, 'build-manifest.json'))
  )
  const statsPath = path.join(build, 'client-stats.json')
  // Continue reading historical webpack baselines; new builds use source maps.
  const stats = fs.existsSync(statsPath)
    ? JSON.parse(fs.readFileSync(statsPath))
    : null
  const loadablePath = path.join(build, 'react-loadable-manifest.json')
  const loadable = JSON.parse(
    fs.readFileSync(
      fs.existsSync(loadablePath)
        ? loadablePath
        : path.join(build, 'server/pages/_app/react-loadable-manifest.json')
    )
  )
  const measure = (files) => {
    const js = [...new Set(files)].filter((file) => file.endsWith('.js'))
    return {
      files: js.length,
      rawBytes: js.reduce(
        (sum, file) => sum + fs.statSync(path.join(build, file)).size,
        0
      ),
      gzipBytes: js.reduce(
        (sum, file) =>
          sum + gzipSync(fs.readFileSync(path.join(build, file))).length,
        0
      )
    }
  }
  function page(file) {
    const html = fs.readFileSync(path.join(build, 'server/pages', file), 'utf8')
    const files = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
      .map((match) => decodeURIComponent(match[1]).split('/_next/')[1])
      .filter(Boolean)
    const names = new Set()
    function walk(modules) {
      for (const module of modules || []) {
        if (module.name) names.add(module.name)
        walk(module.modules)
      }
    }
    for (const chunk of stats?.chunks || []) {
      if (chunk.files.some((file) => files.includes(file))) {
        assert(!chunk.filteredModules, 'Stats omitted chunk modules')
        walk(chunk.modules)
      }
    }
    if (!stats) {
      function readSources(map) {
        for (const source of map.sources || []) names.add(source)
        for (const section of map.sections || []) readSources(section.map)
      }
      for (const file of files.filter((file) => file.endsWith('.js'))) {
        // Generated route manifests contain no application modules.
        if (
          /\/(?:_buildManifest|_ssgManifest|_clientMiddlewareManifest)\.js$/.test(
            file
          )
        )
          continue
        const chunk = path.join(build, file)
        // Turbopack hashes the source map independently of its JS chunk.
        const sourceMap = /\/\/# sourceMappingURL=(\S+)/.exec(
          fs.readFileSync(chunk, 'utf8')
        )?.[1]
        assert(sourceMap, `Missing diagnostic source map reference: ${file}`)
        const map = path.resolve(path.dirname(chunk), sourceMap)
        assert(fs.existsSync(map), `Missing diagnostic source map: ${file}`)
        readSources(JSON.parse(fs.readFileSync(map)))
      }
    }
    return { ...measure(files), modules: [...names] }
  }
  return {
    shared: measure([
      ...manifest.pages['/_app'],
      ...manifest.pages['/[[...index]]']
    ]),
    fixtures: Object.fromEntries(
      ['plain', 'slider', 'snackbar'].map((kind) => [
        kind,
        page(`en/__bundle-check/${kind}.html`)
      ])
    ),
    iframeAliases: Object.entries(loadable)
      .filter(([name]) =>
        name.includes('NamedComponents.tsx -> ./iframe/Iframe')
      )
      .map(([, value]) => value.files)
  }
}

const report = { sites: {}, passed: true }
const forbidden = {
  plain: [
    'components/chat/WhatsappChatButton',
    'components/chat/TawktoChatButton',
    'components/chat/FacebookChatButton',
    'components/card/CardStandalone',
    'components/news/News.tsx',
    'components/event/Event.tsx',
    'components/iframe/Iframe.tsx'
  ],
  slider: [
    'components/tabs/Tabs.tsx',
    'components/image-list/ImageList.tsx',
    'components/image-list/ImageListItem.tsx'
  ],
  snackbar: [
    'components/list-widget/ListSearchAutocomplete.tsx',
    'components/list-widget/CategoryBox.tsx',
    'components/list-widget/ListSearchField.tsx'
  ]
}
for (const site of sites) {
  const before = inspect(baseline, site)
  const after = inspect(candidate, site)
  const violations = []
  for (const [kind, page] of Object.entries(after.fixtures)) {
    const required = {
      plain: 'components/headline/Headline',
      slider: 'components/slider/Slider.tsx',
      snackbar: 'components/snackbar/Snackbar.tsx'
    }[kind]
    if (!page.modules.some((name) => name.includes(required)))
      violations.push(`${kind} did not include its intended renderer`)
    const forbiddenNames = [
      ...forbidden[kind],
      'utils/initial-props/StoryblokService.ts',
      'utils/storyblok/browserClient.ts',
      'utils/storyblok/StoryblokTransport.ts',
      'provider/storyblokPreview.ts',
      '@storyblok/preview-bridge/'
    ]
    for (const needle of forbiddenNames) {
      if (page.modules.some((name) => name.includes(needle)))
        violations.push(`${kind} loads ${needle}`)
    }
  }
  if (after.shared.gzipBytes >= before.shared.gzipBytes)
    violations.push('Shared gzip JavaScript did not decrease')
  // Avoid huge stats dumps or customer content in the report.
  for (const result of [before, after])
    for (const page of Object.values(result.fixtures)) delete page.modules
  report.sites[site] = {
    before,
    after,
    sharedGzipSavedBytes: before.shared.gzipBytes - after.shared.gzipBytes,
    violations
  }
  if (violations.length) report.passed = false
}
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.passed ? 0 : 1
