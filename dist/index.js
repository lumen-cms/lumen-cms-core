
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lumen-cms-core.cjs.production.min.js')
} else {
  module.exports = require('./lumen-cms-core.cjs.development.js')
}
