// Capture public content once and prepare two isolated apps from identical data.
// node scripts/prepare-app-router-pilot.mjs [--reuse]
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import dotenv from 'dotenv'

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const work = path.join(repo, '.next-reference/app-router-pilot')
await fs.mkdir(work, { recursive: true })
process.env.NODE_ENV = 'production'
dotenv.config({ path: path.join(repo, '.env.bali'), quiet: true })
dotenv.config({ path: path.join(repo, '.env'), quiet: true })
const entries = [
  {
    path: '/privacy-policy',
    slug: 'privacy-policy',
    locale: 'en',
    file: 'privacy-policy.json',
    prebuild: true
  },
  {
    path: '/de/datenschutzerklaerung',
    slug: 'datenschutzerklaerung',
    locale: 'de',
    file: 'datenschutzerklaerung.json',
    prebuild: true
  },
  {
    path: '/imprint',
    slug: 'imprint',
    locale: 'en',
    file: 'imprint.json',
    prebuild: false
  }
]
const snapshot = path.join(work, 'snapshot')
await fs.mkdir(snapshot, { recursive: true })
if (!process.argv.includes('--reuse')) {
  const entry = `export { default as getPage } from ${JSON.stringify(path.join(repo, 'src/utils/initial-props/getPageProps.ts'))};
    export { getGoogleFontsCss } from ${JSON.stringify(path.join(repo, 'src/utils/initial-props/googleFontsCache.ts'))};
    export { getFontBasedOnSetting } from ${JSON.stringify(path.join(repo, 'src/utils/parseFont.ts'))};`
  const bundle = path.join(work, 'capture.mjs')
  await build({
    stdin: { contents: entry, resolveDir: repo, loader: 'ts' },
    outfile: bundle,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    logLevel: 'error'
  })
  const { getPage, getGoogleFontsCss, getFontBasedOnSetting } = await import(
    pathToFileURL(bundle).href
  )
  const fonts = {}
  for (const route of entries) {
    const content = await getPage(route.slug, {
      locale: route.locale,
      locales: ['en', 'de'],
      defaultLocale: 'en',
      insideStoryblok: false
    })
    if (!content.page || !content.settings || content.needAuth)
      throw Error(`Missing public pilot page: ${route.path}`)
    await fs.writeFile(path.join(snapshot, route.file), JSON.stringify(content))
    const href = getFontBasedOnSetting(content.settings)
    const css = getGoogleFontsCss(href)
    if (css) fonts[href] = css
    console.log('Captured published page:', route.path, content.page.uuid)
  }
  await fs.writeFile(path.join(snapshot, 'fonts.json'), JSON.stringify(fonts))
}
await fs.writeFile(
  path.join(snapshot, 'manifest.json'),
  JSON.stringify(entries, null, 2)
)
for (const mode of ['pages', 'app']) {
  const target = path.join(work, mode)
  await fs.mkdir(target, { recursive: true })
  await fs.cp(snapshot, path.join(target, 'content'), { recursive: true })
  await fs.cp(
    path.join(repo, 'test/app-router-pilot', mode),
    path.join(target, mode),
    { recursive: true }
  )
  await fs.cp(
    path.join(repo, 'test/app-router-pilot/shared'),
    path.join(target, mode === 'app' ? 'app/shared' : 'shared'),
    { recursive: true }
  )
  for (const directory of ['node_modules', 'public']) {
    try {
      await fs.symlink(
        path.join(repo, directory),
        path.join(target, directory),
        'dir'
      )
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
  }
  await fs.writeFile(
    path.join(target, 'package.json'),
    JSON.stringify({ name: 'lumen-app-router-pilot-' + mode, private: true })
  )
  await fs.writeFile(
    path.join(target, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ESNext',
          lib: ['dom', 'dom.iterable', 'esnext'],
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'react-jsx',
          paths: {
            '@core/*': [path.relative(target, path.join(repo, 'src/*'))]
          }
        },
        include: [
          '**/*.ts',
          '**/*.tsx',
          path.join(repo, 'src/typings/**/*.d.ts')
        ],
        exclude: ['node_modules']
      },
      null,
      2
    )
  )
  await fs.writeFile(
    path.join(target, 'next.config.js'),
    `const base = require(${JSON.stringify(path.join(repo, 'config/nextjs_base_config'))});
module.exports = { ...base({ignoreCsp:true}), cacheComponents:false, turbopack:{root:${JSON.stringify(repo)}}, ${mode === 'pages' ? "i18n:{locales:['en','de'],defaultLocale:'en',localeDetection:false}," : ''} }\n`
  )
  // These ignored local files let standalone builds/starts use identical public
  // runtime settings. Never write the draft token to a pilot app.
  await fs.writeFile(
    path.join(target, '.env.local'),
    Object.entries({ ...process.env, NEXT_PUBLIC_DISABLE_PREFETCH: '1' })
      .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('\n')
  )
  console.log('Prepared:', path.relative(repo, target))
}
