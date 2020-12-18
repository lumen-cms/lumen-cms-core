const config = require('./config/nextjs_dev_config')
const redirectFunc = require('./config/localeRedirect')

const nextConfig = {
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en'
    // domains: [
    //   {
    //     domain: 'studentsgoabroad.org',
    //     defaultLocale: 'en'
    //   },
    //   {
    //     domain: 'studentsgoabroad.com',
    //     defaultLocale: 'de'
    //   }
    // ]
  },
  // strictMode: true // need to wait until v5 of material UI
  async redirects() {
    // const reds = await redirectFunc(['de', 'it', 'es'])
    // return reds
    return []
  }
}

module.exports = config(nextConfig, [], false)
