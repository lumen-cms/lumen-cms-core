const buildConfig = require('./config/nextjs_dev_config')
const redirectFunc = require('./config/localeRedirect')
const getBaseConfig = require('./config/nextjs_base_config')
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...getBaseConfig({})
  // i18n: {
  //   locales: ['en', 'cn', 'de'],
  //   defaultLocale: 'en'
  // }
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
  // async rewrites() {
  //   return {
  //     beforeFiles: [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
  //   }
  // }
}

// module.exports = config(nextConfig, [], false)
module.exports = buildConfig(nextConfig)
