const config = require('./nextjs_prod_config.js')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZE === 'true'
})

module.exports = function (env = {}, plugins = []) {
  plugins.unshift([withBundleAnalyzer])
  return config(env, plugins)
}
