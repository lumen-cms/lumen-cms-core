
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lumen-cms-base.cjs.production.min.js')
} else {
  module.exports = require('./lumen-cms-base.cjs.development.js')
}
