import { expect, it } from 'vitest'
import { build } from 'esbuild'
import { resolve } from 'node:path'

it('bundles public Astro server entrypoints without Next or UI framework runtimes', async () => {
  const routes = ['preview', 'exit-preview', 'clear-cache', 'form-endpoint', 'feed', 'sitemap']
  const result = await build({
    stdin: {
      contents: [
        `export { loadPage, staticRoutes } from 'lumen-cms-astro/server/pages'`,
        `export { SSR_CONFIG } from 'lumen-cms-astro/server/config'`,
        ...routes.map((route, index) => `export { ALL as route${index} } from 'lumen-cms-astro/server/${route}'`),
      ].join('\n'),
      resolveDir: resolve('packages/lumen-cms-astro'),
      loader: 'ts',
    },
    bundle: true, platform: 'node', format: 'esm', write: false, metafile: true,
    define: { 'import.meta.env.DEV': 'false' },
  })
  expect(Object.keys(result.metafile.inputs).filter(path => /node_modules.*(?:\/react(?:-dom)?\/|\/next\/|\/@mui\/|\/@emotion\/)/.test(path))).toEqual([])
  expect(Object.values(result.metafile.outputs)[0].exports).toEqual(['SSR_CONFIG', 'loadPage', ...routes.map((_, index) => `route${index}`), 'staticRoutes'])
})

it('keeps the Astro server page-data entry free from UI framework runtime code', async () => {
  const result = await build({
    entryPoints: ['packages/lumen-cms-astro/src/server/pages.ts', 'packages/lumen-cms-shared/src/theme.ts', 'packages/lumen-cms-shared/src/seo.ts'],
    bundle: true, platform: 'node', format: 'esm', write: false, metafile: true,
    outdir: '/tmp/lumen-server-audit'
  })
  const inputs = Object.keys(result.metafile.inputs)
  expect(inputs.filter(path => /node_modules.*(?:\/react(?:-dom)?\/|\/next\/|\/@mui\/|\/@emotion\/)/.test(path))).toEqual([])
  expect(inputs).toContain('packages/lumen-cms-shared/src/core/utils/initial-props/component-data/googleFormsToJson.ts')
  expect(inputs).toContain('packages/lumen-cms-shared/src/core/utils/initial-props/getPageProps.ts')
})

it('keeps native form and search clients free of React Hook Form and UI framework runtimes', async () => {
  const result = await build({
    entryPoints: ['packages/lumen-cms-astro/src/client/googleForm.ts', 'packages/lumen-cms-astro/src/client/formBuilder.ts', 'packages/lumen-cms-astro/src/client/search.ts', 'packages/lumen-cms-astro/src/client/player.ts', 'packages/lumen-cms-astro/src/client/listStories.ts'],
    bundle: true, platform: 'browser', format: 'esm', write: false, metafile: true,
    outdir: '/tmp/lumen-form-client-audit'
  })
  const inputs = Object.keys(result.metafile.inputs)
  expect(inputs.filter(path => /node_modules.*(?:\/react(?:-dom)?\/|\/react-hook-form(?:-mui)?\/|\/next\/|\/@mui\/|\/@emotion\/)/.test(path))).toEqual([])
  expect(inputs).toContain('packages/lumen-cms-shared/src/core/vendor/google-forms/submitToGoogleForms.ts')
  expect(inputs).not.toContain('packages/lumen-cms-shared/src/core/utils/config.ts')
})
