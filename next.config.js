const config = require('./config/nextjs_dev_config')
const redirectFunc = require('./config/localeRedirect')

const nextConfig = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  async redirects() {
    // const reds = await redirectFunc(['de', 'it', 'es'])
    // return reds
    return []
  }
}

module.exports = config(nextConfig)
