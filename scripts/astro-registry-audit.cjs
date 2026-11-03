// Registry coverage only: dispatch does not establish behavioral/visual parity.
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const root = path.resolve(__dirname, '..')
const files = execFileSync('rg', ['--files', 'src/components', '-g', '*Components.tsx'], { cwd: root, encoding: 'utf8' }).trim().split('\n')
const registered = new Set()
const disabled = new Set()
for (const file of files) for (const match of fs.readFileSync(path.join(root, file), 'utf8').matchAll(/^LmCoreComponents\.([a-z_]+)\s*=\s*\(\)\s*=>\s*null/gm)) disabled.add(match[1])
for (const file of files) for (const match of fs.readFileSync(path.join(root, file), 'utf8').matchAll(/LmCoreComponents\.([a-z_]+)\s*(?:=|\.push)/g)) registered.add(match[1])
const { components } = require('../packages/lumen-cms-astro/src/lib/componentRegistry.mjs')
const dispatched = new Set(Object.keys(components))
for (const [name, component] of Object.entries(components)) {
 if (!fs.existsSync(path.join(root, 'packages/lumen-cms-astro/src', `${component}.astro`))) throw new Error(`Missing Astro component for ${name}: ${component}`)
}
const hooks = ['lm_app_providers', 'lm_link_render', 'parallax_provider']
const result = {
 note: 'Dispatch inventory, not a parity test. Registered components may still lack props/behaviors; provider/override hooks require separate migration.',
 legacyComponents: [...registered].filter(key => !hooks.includes(key)).sort(),
 missingDispatch: [...registered].filter(key => !hooks.includes(key) && !dispatched.has(key)).sort(),
 intentionallyDisabled: [...disabled].sort(),
 legacyHooks: [...registered].filter(key => hooks.includes(key)).sort(),
 astroDispatch: [...dispatched].sort()
}
if (process.argv.includes('--write')) fs.writeFileSync(path.join(root, 'docs/astro-registry-coverage.json'), JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ legacyComponents: result.legacyComponents.length, dispatchedLegacyComponents: result.legacyComponents.length - result.missingDispatch.length, missingDispatch: result.missingDispatch, intentionallyDisabled: result.intentionallyDisabled, legacyHooks: result.legacyHooks }, null, 2))
