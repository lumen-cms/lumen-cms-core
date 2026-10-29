const buildConfig = require('./config/nextjs_dev_config')
const redirectFunc = require('./config/localeRedirect')
const getBaseConfig = require('./config/nextjs_base_config')
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...getBaseConfig({ ignoreCsp: true }),
  distDir: process.env.NEXT_DIST_DIR || '.next',
  allowedDevOrigins: ['127.0.0.1'],
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localeDetection: false
  },
  experimental: {
    ...getBaseConfig().experimental,
    largePageDataBytes: 512 * 1000
  }
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
