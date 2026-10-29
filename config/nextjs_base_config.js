const getSecureHeader = require('./nextjs_csp_generator')
module.exports = ({
  contentSecurityPolicy = {},
  ignoreCsp,
  transpilePackages = ['lumen-cms-core']
} = {}) => {
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    reactStrictMode: true,
    experimental: {
      // Match production chunking in dev to avoid missing next/dynamic preloads.
      // https://github.com/vercel/next.js/issues/99149
      turbopackClientSideNestedAsyncChunking: true
    },
    // Lab's TabList must share the bundled Material UI context with Tab.
    // Externalizing Lab while bundling Material creates two server contexts.
    transpilePackages: [...new Set(['@mui/lab', ...transpilePackages])],
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: '/:path*',
          headers: getSecureHeader({ ignoreCsp, contentSecurityPolicy })
        }
      ]
    },
    images: {
      formats: ['image/avif', 'image/webp'],
      // Preserve the quality used by ToolbarLogo with Next.js 16's allowlist.
      qualities: [75, 95],
      // path: 'https://img-12.lumen.media/_next/image/',
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'a.storyblok.com'
        },
        {
          protocol: 'https',
          hostname: 'img2.storyblok.com'
        },
        {
          protocol: 'https',
          hostname: 'cdn.shopify.com'
        },
        {
          protocol: 'https',
          hostname: 'cdn.jsdelivr.net'
        },
        {
          protocol: 'https',
          hostname: '**.public.blob.vercel-storage.com'
        }
      ],
      deviceSizes: [360, 640, 768, 1024, 1280, 1536],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },
    async rewrites() {
      return {
        beforeFiles: [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
      }
    }
  }

  return config
}
