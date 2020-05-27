let config = require('lumen-cms-nextjs/src/config/nextjs_prod_config')

module.exports = config({
  NEXT_PUBLIC_PREVIEW_TOKEN: 'Jn1ErBzys8vQOgwKQgeiDQtt',
  NEXT_PUBLIC_PUBLIC_TOKEN: 'riNEK11ti3rXnRU2RCNDqAtt',
  NEXT_PUBLIC_LANGUAGES: 'en',
  NEXT_PUBLIC_DEFAULT_LOCALE: 'en'
  // rootDirectory: process.env.rootDirectory,
  // overwriteLocale: process.env.overwriteLocale,
  // suppressSlugLocale: process.env.suppressSlugLocale,
  // TAWKTO: '5923d96d8028bb732704747b',
  // GA: 'UA-27070879-1'
})
