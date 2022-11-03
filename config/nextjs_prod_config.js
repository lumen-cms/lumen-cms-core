const withPlugins = require('next-compose-plugins')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const getCsp = require('./nextjs_csp_generator')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZE === 'true'
})


module.exports = function(nextConfig = {}, plugins = [], transpileModules) {
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    ...nextConfig,
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Permissions-Policy',
              value:
                'camera=(), microphone=(), geolocation=(), interest-cohort=()'
            },
            process.env.NODE_ENV !== 'development' &&
            !nextConfig.ignoreCsp && {
              key: 'Content-Security-Policy',
              value: getCsp(nextConfig.extendCsp || {})
            }
          ].filter((i) => i)
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

    // reactStrictMode: true,
    ...(nextConfig.rewrites || {
      async rewrites() {
        return [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
      }
    }),
    // reactStrictMode: true, // => not working currently
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false
      }

      if (transpileModules !== false) {
        config.resolve.plugins.push(new TsconfigPathsPlugin())
      }
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
    }
  }


  let pluginConfiguration = []
  if (transpileModules !== false) {
    const withTM = require('next-transpile-modules')([
      ...['lumen-cms-core'],
      ...(transpileModules || [])
    ])
    pluginConfiguration.push([withTM])
  }

  plugins.unshift([withBundleAnalyzer])
  if (plugins.length) {
    plugins.forEach((plugin) => {
      if (!Array.isArray(plugin)) {
        throw new Error('plugin configuration must be wrapped in an array.')
      }
      pluginConfiguration.unshift(plugin)
    })
  }

  return withPlugins(pluginConfiguration, config)
}

