const withPlugins = require('next-compose-plugins')
// const {TsconfigPathsPlugin} = require('tsconfig-paths-webpack-plugin')
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = function (
  env = {},
  plugins = [],
  transpileModules = [],
  redirects = []
) {
  const withTM = require('next-transpile-modules')([
    ...['lumen-cms-core', 'lumen-cms-nextjs'],
    ...transpileModules
  ])
  const config = {
    experimental: {
      modern: true
    },
    async rewrites() {
      return [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
    },
    async redirects() {
      return redirects
    },
    env,
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
