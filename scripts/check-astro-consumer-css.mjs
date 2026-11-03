import assert from 'node:assert/strict'
import { cp, mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import postcss from 'postcss'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'packages/lumen-cms-astro')
const requireAstro = createRequire(join(source, 'package.json'))
const { default: tailwindcss } = await import(requireAstro.resolve('@tailwindcss/vite'))
const consumer = await mkdtemp(join(tmpdir(), 'lumen-consumer-css-'))
try {
  // A real directory under node_modules matters: a workspace symlink resolves
  // back into the repo and masks Tailwind's dependency-scanning exclusion.
  const installed = join(consumer, 'node_modules/lumen-cms-astro')
  await mkdir(installed, { recursive: true })
  await cp(join(source, 'src'), join(installed, 'src'), { recursive: true })
  await symlink(join(source, 'node_modules'), join(installed, 'node_modules'), 'dir')
  await writeFile(join(consumer, 'index.html'), '<script type="module" src="/main.js"></script>')
  await writeFile(join(consumer, 'main.js'), "import './node_modules/lumen-cms-astro/src/styles/global.css'\n")
  const result = await build({
    root: consumer, configFile: false, logLevel: 'error', plugins: [tailwindcss()],
    build: { write: false, minify: false, cssMinify: false },
  })
  const css = (Array.isArray(result) ? result : [result]).flatMap(item => item.output)
    .filter(item => item.type === 'asset' && item.fileName.endsWith('.css'))
    .map(item => String(item.source)).join('\n')
  const selectors = new Set()
  postcss.parse(css).walkRules(rule => selectors.add(rule.selector))
  for (const selector of ['.btn', '.btn-primary', '.btn-secondary', '.btn-ghost', '.btn-outline', '.btn-neutral', '.btn-success', '.btn-info', '.btn-warning', '.btn-error', '.dropdown', '.menu', '.input', '.select', '.textarea', '.checkbox', '.bg-base-100', '.w-full']) {
    assert(selectors.has(selector), `Installed Astro package is missing generated CSS for ${selector}`)
  }
  assert(selectors.has('.transition-transform'), 'Accordion transform transitions must survive package installation')
  assert([...selectors].some(selector => selector.includes('lm-accordion-indicator') && selector.includes('rotate-180')), 'Accordion open-state rotation must survive package installation')
  for (const selector of ['.avatar', '.badge', '.navbar', '.card', '.carousel', '.carousel-item', '.loading', '.collapse', '.label', '.alert', '.indicator', '.radio', '.progress']) {
    assert(selectors.has(selector), `Renderer component styles must remain available: ${selector}`)
  }
  for (const selector of ['.tabs', '.countdown', '.table-zebra', '.drawer', '.timeline']) {
    assert(!selectors.has(selector), `CMS names must not pull in unused DaisyUI components: ${selector}`)
  }
  console.log('Installed Astro consumer CSS includes navigation, button variants, forms and layout utilities.')
} finally {
  await rm(consumer, { recursive: true, force: true })
}
