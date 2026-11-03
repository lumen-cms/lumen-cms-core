const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
// Only generated schemas are mirrored. Framework-neutral extensions and delivery
// code are maintained in the shared package, not overwritten from Next sources.
for (const directory of ['typings/generated', 'typings/storyblok/types', 'travel/typings/generated']) {
 const source = path.join(root, 'src', directory)
 const destination = path.join(root, 'packages/lumen-cms-shared/src/core', directory)
 for (const entry of fs.readdirSync(destination, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue
  const target = path.join(entry.parentPath, entry.name)
  const file = path.join(source, path.relative(destination, target))
  if (!fs.existsSync(file)) throw new Error(`Generated schema no longer exists: ${file}`)
  fs.copyFileSync(file, target)
 }
}
console.log('Refreshed the generated schemas used by Astro/shared.')
