// The same remote authorization policy as the legacy Next image optimizer.
export const lumenImageConfig = {
  service: { entrypoint: 'astro/assets/services/sharp' },
  remotePatterns: [
    ...['a.storyblok.com', 'img2.storyblok.com', 'cdn.shopify.com', 'cdn.jsdelivr.net'].map(hostname => ({ protocol: 'https', hostname })),
    { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
  ],
}
