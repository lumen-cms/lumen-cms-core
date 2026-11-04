import { execFileSync } from 'node:child_process'
import { expect, it } from 'vitest'

it.each(['--sample', '--config=astro.server.config.mjs'])('rejects %s before starting a Generate build', argument => {
 expect(() => execFileSync(process.execPath, ['scripts/astro-site.cjs', 'bali', 'generate', argument], { stdio: 'pipe' })).toThrow(/Generate requires a complete static build/)
})

it('rejects inherited sample inventories before starting a Generate build', () => {
 expect(() => execFileSync(process.execPath, ['scripts/astro-site.cjs', 'bali', 'generate'], {
  stdio: 'pipe', env: { ...process.env, LUMEN_SAMPLE_ROUTES: '["/"]' },
 })).toThrow(/Generate requires a complete static build/)
})
