/** Collection is opt-in; the Vercel project controls pricing, not the SDK. */
export function speedInsightsOptions({ enabled, vercelEnv, production, preview, sampleRate }: {
 enabled?: string
 vercelEnv?: string
 production: boolean
 preview: boolean
 sampleRate?: string
}): { sampleRate: number } | undefined {
 if (enabled !== '1' || vercelEnv !== 'production' || !production || preview) return
 const rate = sampleRate === undefined ? 0.1 : Number(sampleRate)
 // Invalid configuration fails closed instead of collecting at the SDK's 100% default.
 if (!Number.isFinite(rate) || rate <= 0 || rate > 1) return
 return { sampleRate: rate }
}
