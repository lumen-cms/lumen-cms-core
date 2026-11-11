import { expect, it } from 'vitest'
import { speedInsightsOptions } from '../../packages/lumen-cms-astro/src/lib/speedInsights'

const production = { enabled: '1', vercelEnv: 'production', production: true, preview: false }
it('samples 10% by default and allows an explicit rate', () => {
 expect(speedInsightsOptions(production)).toEqual({ sampleRate: 0.1 })
 expect(speedInsightsOptions({ ...production, sampleRate: '0.25' })).toEqual({ sampleRate: 0.25 })
})
it.each([
 { enabled: undefined }, { enabled: '0' }, { vercelEnv: undefined },
 { vercelEnv: 'preview' }, { vercelEnv: 'development' },
 { production: false }, { preview: true },
 ...['0', '-1', '1.1', 'NaN', 'Infinity', '', 'invalid'].map(sampleRate => ({ sampleRate })),
])('does not collect with %j', override => {
 expect(speedInsightsOptions({ ...production, ...override })).toBeUndefined()
})
