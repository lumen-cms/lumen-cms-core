const config = require('./nextjs_prod_config.js')

module.exports = function(env = {}, plugins = [], transpileModules) {
  plugins.unshift([withBundleAnalyzer])
  return config(env, plugins, transpileModules)
}
