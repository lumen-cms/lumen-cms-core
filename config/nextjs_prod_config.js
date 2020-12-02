const withPlugins = require('next-compose-plugins')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = function (
  nextConfig = {},
  plugins = [],
  transpileModules = []
) {
  const withTM = require('next-transpile-modules')([
    ...['lumen-cms-core', 'lumen-cms-nextjs'],
    ...transpileModules
  ])
  const config = {
    ...nextConfig,
    images: {
      domains: ['a.storyblok.com', 'img2.storyblok.com', 'cdn.shopify.com'],
      deviceSizes: [360, 420, 510, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },
    async rewrites() {
      return [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
    },
    // reactStrictMode: true, // => not working currently
    webpack: (config, options) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty'
      }

      if (options.isServer) {
        config.externals = ['react', ...config.externals]
      }

      config.resolve = config.resolve || {}
      config.resolve.plugins = config.resolve.plugins || []
      config.resolve.plugins.push(new TsconfigPathsPlugin())
      if (!options.isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }

      config.module.rules.push({
        test: /\.graphql$/,
        exclude: /node_modules\/(?!(lumen-cms-core|lumen-cms-ecommerce|lumen-cms-travel)\/).*/,
        use: [
          {
            loader: 'graphql-tag/loader'
          }
        ]
      })

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
    [withTM]
  ]

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
