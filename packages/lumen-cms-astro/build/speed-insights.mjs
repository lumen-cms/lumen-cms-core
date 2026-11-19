import { fileURLToPath } from 'node:url'

export function speedInsightsEnabled(value) {
 return value === '1' || value?.toLowerCase() === 'true'
}

/** Remove the component before Astro discovers scripts and builds client entries. */
export function optionalSpeedInsights({ enabled, vercelEnv, buildMode }) {
 const include = speedInsightsEnabled(enabled) && vercelEnv === 'production' && buildMode === 'public'
 const component = fileURLToPath(new URL('../src/components/SpeedInsights.astro', import.meta.url))
 return {
  name: 'lumen-optional-speed-insights',
  enforce: 'pre',
  load(id) {
   if (!include && id.split('?')[0] === component) return '---\n---\n'
  },
 }
}
