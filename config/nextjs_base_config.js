const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const getSecureHeader = require('./nextjs_csp_generator')
module.exports = ({
                    contentSecurityPolicy = {},
                    ignoreCsp
                  }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    reactStrictMode: true,
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
      path: 'https://img-12.lumen.media/_next/image/',
      domains: [
        'a.storyblok.com',
        'img2.storyblok.com',
        'cdn.shopify.com',
        'cdn.jsdelivr.net'
      ],
      deviceSizes: [360, 420, 510, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false
      }

      config.resolve.plugins.push(new TsconfigPathsPlugin())
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }

      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()
        if (entries['main.js']) {
          entries['main.js'].unshift('@polyfills')
        }
        return entries
      }
      return config
    },
    async rewrites() {
      return {
        beforeFiles: [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
      }
    }
  }

  return config
}
