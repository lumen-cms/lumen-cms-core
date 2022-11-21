const nextSafe = require('next-safe')
const isDev = process.env.NODE_ENV !== 'production'

const ContentSecurityPolicy = {
  'script-src-elem': ['\'self\'', '\'unsafe-inline\'', '*.storyblok.com'],
  defaultSrc: `default-src 'self' *.storyblok.com vercel.com *.vercel.com *.stripe.com twitter.com google.com *.google.com *.facebook.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://*.google.com https://*.facebook.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io chrome-extension://*`,
  'child-src': ['*.studentsgoabroad.com', '*.studentsgoabroad.org', '*.hubspot.com/', '*.facebook.com', 'connect.facebook.net', '*.youtube.com', '*.youtube-nocookie.com', '*.stripe.com', 'www.google.com', 'github.com vercel.com', '*.vercel.com,', '*.stripe.com twitter.com', '*.twitter.com', '*.github.com', '*.vimeo.com', '*.googletagmanager.com', '*.hubspot.com', '.hsforms.com', 'js.hsadspixel.net', 'js.hscollectedforms.net', 'js.usemessages.com', 'js.hsforms.net'],
  'style-src': ['\'self\'', '\'unsafe-inline\'', '*', 'wss://*', 'chrome-extension://*'],
  'img-src': ['*', 'blob:', 'data:'],
  mediaSrc: [`media-src *`],
  'font-src': ['\'self\'', '*', 'data:'],
  'script-src': ['\'self\'', '\'unsafe-inline\''],
  'worker-src': ['\'self\'', 'blob:'],
  'connect-src': ['\'self\'', '*'],
  'frame-ancestors': ['*.tawk.to', '*.studentsgoabroad.com', '*.studentsgoabroad.org', '*.storyblok.com', '*.facebook.com', '*.facebook.net', '*.hubspot.com', '*.hsforms.com', '*.hsadspixel.net', '*.hscollectedforms.net', '*.usemessages.com']
}

const hubspotCsp = {
  scriptSrc:
    '*.hsleadflows.net *.hs-banner.com *.hsadspixel.net  *.hubspotfeedback.com *.usemessages.com *.hs-analytics.net *.hscollectedforms.net *.hsforms.com *.hs-scripts.com *.hsforms.com'
}

module.exports = ({ ignoreCsp, nextSafeOptions = {} }) =>
  nextSafe({
    isDev,
    contentSecurityPolicy: ignoreCsp ? false : {
      'img-src': [...ContentSecurityPolicy['img-src'], ...nextSafeOptions.contentSecurityPolicy?.['img-src']],
      'font-src': [...ContentSecurityPolicy['font-src'], ...nextSafeOptions.contentSecurityPolicy?.['font-src']],
      'script-src': [...ContentSecurityPolicy['script-src'], ...nextSafeOptions.contentSecurityPolicy?.['script-src']],
      'worker-src': [...ContentSecurityPolicy['worker-src'], ...nextSafeOptions.contentSecurityPolicy?.['worker-src']],
      'style-src': [...ContentSecurityPolicy['style-src'], ...nextSafeOptions.contentSecurityPolicy?.['style-src']],
      'connect-src': [...ContentSecurityPolicy['connect-src'], ...nextSafeOptions.contentSecurityPolicy?.['connect-src']],
      'script-src-elem': [...ContentSecurityPolicy['script-src-elem'], ...nextSafeOptions.contentSecurityPolicy?.['script-src-elem']],
      'frame-ancestors': [...ContentSecurityPolicy['frame-ancestors'], ...nextSafeOptions.contentSecurityPolicy?.['frame-ancestors']],
      'child-src': [...ContentSecurityPolicy['child-src'], ...nextSafeOptions.contentSecurityPolicy?.['child-src']]
    }
  })


/**
 * @param extendCsp
 * @returns {string}
 */
// const getCsp = (extendCsp) => {
//   Object.keys(extendCsp).forEach((key) => {
//     if (ContentSecurityPolicy[key]) {
//       ContentSecurityPolicy[key] += ` ${extendCsp[key]}`
//     }
//   })
//   Object.keys(hubspotCsp).forEach((key) => {
//     if (ContentSecurityPolicy[key]) {
//       ContentSecurityPolicy[key] += ` ${hubspotCsp[key]}`
//     }
//   })
//   return Object.values(ContentSecurityPolicy).join('; ')
// }
