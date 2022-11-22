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

const coreHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
]

module.exports = ({ ignoreCsp, contentSecurityPolicy = {} }) => {
  const headers = coreHeaders
  if (!ignoreCsp) {
    // todo push into headers
  }
  // const nextHeaders = nextSafe({
  //   isDev,
  //   frameOptions: {},
  //   contentSecurityPolicy: ignoreCsp ? false : {
  //     'img-src': [...ContentSecurityPolicy['img-src'], ...contentSecurityPolicy?.['img-src']],
  //     'font-src': [...ContentSecurityPolicy['font-src'], ...contentSecurityPolicy?.['font-src']],
  //     'script-src': [...ContentSecurityPolicy['script-src'], ...contentSecurityPolicy?.['script-src']],
  //     'worker-src': [...ContentSecurityPolicy['worker-src'], ...contentSecurityPolicy?.['worker-src']],
  //     'style-src': [...ContentSecurityPolicy['style-src'], ...contentSecurityPolicy?.['style-src']],
  //     'connect-src': [...ContentSecurityPolicy['connect-src'], ...contentSecurityPolicy?.['connect-src']],
  //     'script-src-elem': [...ContentSecurityPolicy['script-src-elem'], ...contentSecurityPolicy?.['script-src-elem']],
  //     'frame-ancestors': [...ContentSecurityPolicy['frame-ancestors'], ...contentSecurityPolicy?.['frame-ancestors']],
  //     'child-src': [...ContentSecurityPolicy['child-src'], ...contentSecurityPolicy?.['child-src']]
  //   }
  // })
  return headers
}
