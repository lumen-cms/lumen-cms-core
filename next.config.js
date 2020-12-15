const config = require('./config/nextjs_dev_config')
const redirectFunc = require('./config/localeRedirect')

const nextConfig = {
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de'
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
  async redirects() {
    // const reds = await redirectFunc(['de', 'it', 'es'])
    // return reds
    return []
  }
}

module.exports = config(nextConfig, [], false)
