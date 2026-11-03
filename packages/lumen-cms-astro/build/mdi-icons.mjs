import { readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const moduleId = 'virtual:lumen-mdi-icons'
const resolvedId = `\0${moduleId}`

// Resolve from this package, not the consumer's working directory. Embed the
// catalog in the server bundle so serverless deployments need no SVG files.
export function mdiIcons() {
 let catalog
 return {
  name: 'lumen-mdi-icons',
  resolveId(id) { if (id === moduleId) return resolvedId },
  async load(id, options) {
   if (id !== resolvedId) return
   if (options?.ssr === false) throw new Error('The MDI SVG catalog is server-only')
   catalog ??= (async () => {
    const directory = join(dirname(require.resolve('@mdi/svg/package.json')), 'svg')
    const files = (await readdir(directory)).filter(file => file.endsWith('.svg')).sort()
    const icons = await Promise.all(files.map(async file => [file.slice(0, -4), await readFile(join(directory, file), 'utf8')]))
    return `export default ${JSON.stringify(Object.fromEntries(icons))}`
   })()
   return catalog
  },
 }
}
