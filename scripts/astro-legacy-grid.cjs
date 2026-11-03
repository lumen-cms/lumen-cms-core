const { build } = require('esbuild')
const Module = require('node:module')
const path = require('node:path')
async function legacyGridHtml() {
  const root = path.resolve(__dirname, '..')
  const result = await build({ stdin: { resolveDir: root, loader: 'tsx', contents: `
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { ConfiguredGlobalTheme } from './src/components/global-theme/ConfiguredGlobalTheme'
    import { selectThemeConfig } from './src/components/global-theme/themeConfig'
    import { LmSection } from './src/components/section/Section'
    import { LmGridRow } from './src/components/section/GridRow'
    import { LmGridColumn } from './src/components/section/GridColumn'
    export const html = renderToStaticMarkup(<ConfiguredGlobalTheme config={selectThemeConfig({ component: 'global', _uid: 'test' } as any)}>
      <LmSection content={{ component: 'section', _uid: 'section', max_width: 'lg', section_identifier: 'grid-geometry-fixture' }}>
        <LmGridRow content={{ component: 'row', _uid: 'row' }}>
          <LmGridColumn content={{ component: 'column', _uid: 'col1', width_general: '6' }} parent={{}}><p>First column</p></LmGridColumn>
          <LmGridColumn content={{ component: 'column', _uid: 'col2', width_general: '6' }} parent={{}}><p>Second column</p></LmGridColumn>
        </LmGridRow>
      </LmSection>
    </ConfiguredGlobalTheme>)
  ` }, bundle: true, platform: 'node', format: 'cjs', packages: 'external', write: false })
  const runtime = new Module(path.join(root, 'legacy-grid.cjs'), module)
  runtime.paths = Module._nodeModulePaths(root)
  runtime._compile(result.outputFiles[0].text, path.join(root, 'legacy-grid.cjs'))
  return '<!doctype html><html><head><meta name="viewport" content="width=device-width"></head><body>' + runtime.exports.html + '</body></html>'
}
module.exports = { legacyGridHtml }
