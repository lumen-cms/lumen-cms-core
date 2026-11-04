import { lumenImageConfig } from './config.mjs'

// Shared by the URL builder and the Vercel adapter's deployment allowlist.
export const vercelImageConfig = {
 // Pass patterns explicitly: adapter 11.0.18 drops protocol-qualified Astro patterns.
 remotePatterns: lumenImageConfig.remotePatterns,
 sizes: [16, 32, 48, 64, 96, 128, 150, 256, 300, 360, 384, 640, 768, 1024, 1280, 1536, 2048, 3072, 4096],
 formats: ['image/avif', 'image/webp'],
 minimumCacheTTL: 31536000,
}
