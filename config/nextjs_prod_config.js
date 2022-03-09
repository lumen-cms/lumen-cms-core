const withPlugins = require('next-compose-plugins')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const ContentSecurityPolicy = {
  defaultSrc: `default-src 'self' *.storyblok.com vercel.com *.vercel.com *.stripe.com twitter.com google.com *.google.com *.facebook.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://*.google.com https://*.facebook.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io chrome-extension://*`,
  scriptSrc: `script-src 'self' https://*.studentsgoabroad.com https://*.studentsgoabroad.org *.studentsgoabroad.com *.studentsgoabroad.org *.facebook.com connect.facebook.net *.hubspot.com  *.storyblok.com 'unsafe-eval' 'unsafe-inline' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com *.youtube.com *.youtube-nocookie.com *.ytimg.com *.twimg.com *.zdassets.com cdn.sift.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io https://embed.tawk.to https://cdn.jsdelivr.net/emojione/ chrome-extension://*`,
  childSrc: `child-src https://*.studentsgoabroad.com https://*.studentsgoabroad.org *.studentsgoabroad.com *.studentsgoabroad.org https://meetings.hubspot.com/ *.facebook.com connect.facebook.net *.youtube.com *.youtube-nocookie.com *.stripe.com www.google.com github.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  styleSrc: `style-src 'self' 'unsafe-inline' *.googleapis.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com embed.tawk.to https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  imgSrc: `img-src * blob: data:`,
  mediaSrc: `media-src *`,
  connectSrc: `connect-src *`,
  fontSrc: `font-src 'self' embed.tawk.to *.vercel.com *.gstatic.com data:`,
  workerSrc: `worker-src blob:`,
  frameAncestors: `frame-ancestors va.tawk.to https://*.studentsgoabroad.com https://*.studentsgoabroad.org https://*.storyblok.com *.facebook.com connect.facebook.net`
}

const hubspotCsp = {
  scriptSrc: 'https://js.hs-scripts.com  https://js.hsleadflows.net  https://js.hs-banner.com  https://js.hsadspixel.net  https://js.hubspotfeedback.com  https://js.usemessages.com  https://js.hs-analytics.net  https://js.hscollectedforms.net  https://js.hsforms.net  https://js-na1.hs-scripts.com  https://forms.hsforms.com',
  childSrc: 'app.hubspot.com forms.hsforms.com js.hsadspixel.net js.hscollectedforms.net js.usemessages.com',
  frameAncestors: '*.hubspot.com forms.hsforms.com js.hsadspixel.net js.hscollectedforms.net js.usemessages.com'
}

/**
 * @param extendCsp
 * @returns {string}
 */
const getCsp = (extendCsp) => {
  Object.keys(extendCsp).forEach((key) => {
    if (ContentSecurityPolicy[key]) {
      ContentSecurityPolicy[key] += ` ${extendCsp[key]}`
    }
  })
  Object.keys(hubspotCsp).forEach(key => {
    if(ContentSecurityPolicy[key]) {
      ContentSecurityPolicy[key] += ` ${extendCsp[key]}`
    }
  })
  return Object.values(ContentSecurityPolicy).join('; ')
}

module.exports = function (nextConfig = {}, plugins = [], transpileModules) {
  const enableWebpack5 = true
  /**
   * @type {import("next").NextConfig}
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
              value:
                'camera=(), microphone=(), geolocation=(), interest-cohort=()'
            },
            process.env.NODE_ENV !== 'development' && {
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
