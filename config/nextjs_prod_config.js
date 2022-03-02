const withPlugins = require('next-compose-plugins')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const ContentSecurityPolicy = {
  defaultSrc: `default-src 'self' *.storyblok.com vercel.com *.vercel.com *.stripe.com twitter.com google.com *.google.com *.facebook.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://*.google.com https://*.facebook.com chrome-extension://*`,
  scriptSrc: `script-src 'self' *.storyblok.com 'unsafe-eval' 'unsafe-inline' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com *.youtube.com *.youtube-nocookie.com *.ytimg.com *.twimg.com *.zdassets.com cdn.sift.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io chrome-extension://*`,
  childSrc: `child-src *.facebook.com connect.facebook.net *.youtube.com *.youtube-nocookie.com *.stripe.com www.google.com github.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  styleSrc: `style-src 'self' 'unsafe-inline' *.googleapis.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  imgSrc: `img-src * blob: data:`,
  mediaSrc: `media-src 'self' *.storyblok.com blob: vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  connectSrc: `connect-src *`,
  fontSrc: `font-src 'self' *.vercel.com *.gstatic.com data:`,
  workerSrc: `worker-src blob:`,
  frameAncestors: `frame-ancestors https://*.storyblok.com *.facebook.com connect.facebook.net`
}

/**
 * @param extendCsp
 * @returns {string}
 */
const getCsp = (extendCsp) => {
  Object.keys(extendCsp).forEach(key => {
    if(ContentSecurityPolicy[key]) {
      ContentSecurityPolicy[key] += ` ${extendCsp[key]}`
    }
  })
  return Object.values(ContentSecurityPolicy).join('; ')
}

module.exports = function(nextConfig = {}, plugins = [], transpileModules) {
  const enableWebpack5 = true
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    ...nextConfig,
    swcMinify: true,
    webpack5: enableWebpack5,
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
              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
            },
            {
              key: 'Content-Security-Policy',
              value: getCsp(nextConfig.extendCsp || {})
            }
          ]
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
    /* optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 50000,
        minChunks: 1,
        maxAsyncRequests: 20,
        maxInitialRequests: 10
      }
    },*/
    // reactStrictMode: true, // => not working currently
    webpack: (config, { isServer }) => {
      if (!isServer) {
        if (enableWebpack5) {
          config.resolve.fallback.fs = false
        } else {
          config.node = {
            fs: 'empty'
          }
        }
      }
      //
      //     // if (options.isServer) {
      //     //   config.externals = ['react', ...config.externals]
      //     // }
      //
      //     config.resolve = config.resolve || {}
      //     config.resolve.plugins = config.resolve.plugins || []
      if (transpileModules !== false) {
        config.resolve.plugins.push(new TsconfigPathsPlugin())
      }
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }
      //
      //     config.module.rules.push({
      //       test: /\.graphql$/,
      //       exclude: /node_modules\/(?!(lumen-cms-core|lumen-cms-ecommerce|lumen-cms-travel)\/).*/,
      //       use: [
      //         {
      //           loader: 'graphql-tag/loader'
      //         }
      //       ]
      //     })
      //
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

  let pluginConfiguration = [
    // next-offline
    // [withOffline],
    // [withSourceMaps],
  ]
  if (transpileModules !== false) {
    const withTM = require('next-transpile-modules')([
      ...['lumen-cms-core'],
      ...(transpileModules || [])
    ])
    pluginConfiguration.push([withTM])
  }

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
