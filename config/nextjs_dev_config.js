const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZE === 'true'
})
// const withTM = require('next-transpile-modules')

module.exports = (config, transpile = []) => withBundleAnalyzer(config)
