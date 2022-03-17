const config = require('./config/nextjs_dev_config')
const redirectFunc = require('./config/localeRedirect')

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  experimental: {
    // granularChunks: false
  },
  ignoreCsp: false,
  extendCsp: {},
  i18n: {
    locales: ['en', 'cn', 'de'],
    defaultLocale: 'en'
    // localeDetection: false
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
  // async redirects() {
  //   // const reds = await redirectFunc(['de', 'it', 'es'])
  //   // return reds
  //   return [
  //     {
  //       source:
  //         '/blog/top-5-ways-western-financial-services-firms-are-failing-on-wechat',
  //       destination:
  //         '/case-study/top-5-ways-western-financial-services-firms-are-failing-on-wechat',
  //       permanent: true,
  //       locale: false
  //     }
  //   ]
  // },
  async rewrites() {
    return {
      beforeFiles: [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
    }
  }
}

module.exports = config(nextConfig, [], false)
