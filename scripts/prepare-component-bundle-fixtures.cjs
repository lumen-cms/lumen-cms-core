// Add diagnostic routes and client source maps only to isolated consumer copies.
// Usage: node scripts/prepare-component-bundle-fixtures.cjs <prepared consumer root>
const fs = require('fs')
const path = require('path')
const root = process.argv[2]
if (
  !root ||
  JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).name !==
    'lumen-consumer-verification'
)
  throw new Error(
    'Expected an isolated workspace from prepare-consumer-verification.cjs'
  )
for (const site of ['baliinternships', 'planet-training', 'upskill']) {
  const config = fs.readFileSync(
    path.join(root, 'packages', site, 'next.config.js'),
    'utf8'
  )
  if (config.includes('renderOptimizationSourceMaps'))
    throw new Error('Bundle fixtures already prepared')
}

for (const site of ['baliinternships', 'planet-training', 'upskill']) {
  const base = path.join(root, 'packages', site)
  const config = path.join(base, 'next.config.js')
  fs.appendFileSync(
    config,
    `
// renderOptimizationSourceMaps: diagnostic builds only, never deployed.
module.exports.productionBrowserSourceMaps = true;
`
  )
  const pages = fs.existsSync(path.join(base, 'src/pages'))
    ? path.join(base, 'src/pages')
    : path.join(base, 'pages')
  fs.mkdirSync(path.join(pages, '__bundle-check'), { recursive: true })
  fs.writeFileSync(
    path.join(pages, '__bundle-check/[kind].tsx'),
    `import { LmComponentRender } from 'lumen-cms-core/src/components/CoreComponents'
import pageProps from 'lumen-cms-core/src/utils/initial-props/pagesGetStaticProps'
export async function getStaticPaths() { return { paths: ['plain', 'slider', 'snackbar'].map(kind => ({ params: { kind } })), fallback: false } }
export async function getStaticProps(ctx: any) { const result: any = await pageProps({ ...ctx, params: { index: ['home'] } }); const kind = ctx.params.kind; return { ...result, props: { ...result.props, fixture: kind === 'plain' ? { component: 'headline', _uid: 'title', text: 'Bundle fixture' } : kind === 'slider' ? { component: 'slider', _uid: 'slider', body: [{ component: 'headline', _uid: 'slide', text: 'Slide fixture' }] } : { component: 'snackbar', _uid: 'snackbar', message: 'Notification fixture' } } } }
export default function Fixture({ fixture }: any) { return <LmComponentRender content={fixture} /> }
`
  )
}
