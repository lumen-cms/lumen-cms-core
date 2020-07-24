let config = require('lumen-cms-nextjs/src/config/nextjs_prod_config')

//demo
// NEXT_PUBLIC_PREVIEW_TOKEN=SOBLm54Sdapihgt6ICtuFgtt
// NEXT_PUBLIC_PUBLIC_TOKEN=7IkhR6TuZpDgf9Ka9GQ8fQtt

// NEXT_PUBLIC_PREVIEW_TOKEN: 'UvABqQAdrEMCeCG2N0wePQtt',
//   NEXT_PUBLIC_PUBLIC_TOKEN: 'PhCU8L1FyvZlsW2H522WRQtt',
//   // NEXT_PUBLIC_LANGUAGES: 'en,de',
//   NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
//   NEXT_PUBLIC_ROOT_DIRECTORY: 'etherhill'

// BI
// preview: IQrhrTP6aL0WYgDXmersbgtt
// public: Xzl0aUdUwWqtCsD37fHMmQtt

module.exports = config({
  NEXT_PUBLIC_PREVIEW_TOKEN: 'IQrhrTP6aL0WYgDXmersbgtt',
  NEXT_PUBLIC_PUBLIC_TOKEN: 'Xzl0aUdUwWqtCsD37fHMmQtt',
  NEXT_PUBLIC_LANGUAGES: 'en,de',
  NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
  // NEXT_PUBLIC_ROOT_DIRECTORY: 'etherhill',
  // overwriteLocale: process.env.overwriteLocale,
  // suppressSlugLocale: process.env.suppressSlugLocale,
  // TAWKTO: '5923d96d8028bb732704747b',
  // GA: 'UA-27070879-1'
})
