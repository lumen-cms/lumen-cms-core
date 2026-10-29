// Compatibility entry point for consumers of the old wrapper.
module.exports = (config, transpile = ['lumen-cms-core']) => ({
  ...config,
  transpilePackages: [
    ...new Set([...(config.transpilePackages || []), ...transpile])
  ]
})
