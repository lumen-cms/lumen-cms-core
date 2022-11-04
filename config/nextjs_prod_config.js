const withTM = require('next-transpile-modules')

module.exports = (config, transpile = ['lumen-cms-core']) => withTM(transpile)(config)
