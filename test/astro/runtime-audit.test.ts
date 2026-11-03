import { expect, it } from 'vitest'
import { runtimeAudit } from '../../packages/lumen-cms-astro/build/runtime-audit.mjs'

const audit = (modules: string[], imports: string[] = []) => runtimeAudit().generateBundle.call({
 error(message: string) { throw new Error(message) },
}, {}, { chunk: { type: 'chunk', fileName: 'app.js', modules: Object.fromEntries(modules.map(id => [id, {}])), imports, dynamicImports: [] } })

it('allows workspace folders named react and the calendar Preact runtime', async () => {
 await expect(audit(['/projects/react/site/component.ts', '/site/node_modules/preact/index.js'])).resolves.toBeUndefined()
})
it.each(['react', 'react-dom', 'next', '@mui/material', '@emotion/react'])('rejects bundled or external %s packages', async name => {
 await expect(audit([`/site/node_modules/${name}/index.js`])).rejects.toThrow('Legacy UI runtime')
 await expect(audit([], [name])).rejects.toThrow('Legacy UI runtime')
})
