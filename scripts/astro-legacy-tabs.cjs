const { build } = require('esbuild')
const path = require('node:path')
async function legacyTabsAssets() {
 const root = path.resolve(__dirname, '..')
 const result = await build({ stdin: { resolveDir: root, loader: 'tsx', contents: `
  import React from 'react'
  import { createRoot } from 'react-dom/client'
  import { ThemeProvider, createTheme } from '@mui/material/styles'
  import CssBaseline from '@mui/material/CssBaseline'
  import Tabs from './src/components/tabs/Tabs'
  import { tabFixtures } from './test/astro/fixtures/tabs-parity.mjs'
  const variant = location.pathname.split('/').filter(Boolean).pop()
  createRoot(document.getElementById('root')).render(<ThemeProvider theme={createTheme()}><CssBaseline /><Tabs content={tabFixtures[variant]} /></ThemeProvider>)
 ` }, bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic', outdir: '/virtual', write: false, define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'leaf-content-only', setup(build) {
  // Keep the real Tabs, MUI, Grid and Swiper. Only leaf CMS content is simplified
  // to avoid importing the unrelated application/provider registry in this oracle.
  build.onResolve({ filter: /\/CoreComponents$/ }, () => ({ path: 'leaf-content', namespace: 'parity' }))
  build.onLoad({ filter: /.*/, namespace: 'parity' }, () => ({ loader: 'tsx', resolveDir: root, contents: `import React from 'react'; export function LmComponentRender({content}) { return content.component === 'html' ? <div dangerouslySetInnerHTML={{__html:content.body}} /> : <span>{content.text}</span> }` }))
 } }] })
 return { js: result.outputFiles.find(file => file.path.endsWith('.js')).text, css: result.outputFiles.find(file => file.path.endsWith('.css'))?.text || '' }
}
module.exports = { legacyTabsAssets }
