const ContentSecurityPolicy = {
  defaultSrc: `default-src 'self' *.storyblok.com vercel.com *.vercel.com *.stripe.com twitter.com google.com *.google.com *.facebook.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://*.google.com https://*.facebook.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io chrome-extension://*`,
  childSrc: `child-src https://*.studentsgoabroad.com https://*.studentsgoabroad.org *.studentsgoabroad.com *.studentsgoabroad.org https://meetings.hubspot.com/ *.facebook.com connect.facebook.net *.youtube.com *.youtube-nocookie.com *.stripe.com www.google.com github.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com *.vimeo.com vimeo.com https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  styleSrc: `style-src 'self' 'unsafe-inline' *.googleapis.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com embed.tawk.to https://client.crisp.chat https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  imgSrc: `img-src *.vimeocdn.com *.vimeo.com * blob: data:`,
  mediaSrc: `media-src *`,
  connectSrc: `connect-src *`,
  fontSrc: `font-src 'self' embed.tawk.to *.vercel.com *.gstatic.com data:`,
  workerSrc: `worker-src blob:`,
  frameAncestors: `frame-ancestors va.tawk.to https://*.studentsgoabroad.com https://*.studentsgoabroad.org https://*.storyblok.com *.facebook.com connect.facebook.net`
}

const hubspotCsp = {
  scriptSrc:
    'js.hs-scripts.com js.hsleadflows.net js.hs-banner.com js.hsadspixel.net  js.hubspotfeedback.com js.usemessages.com js.hs-analytics.net js.hscollectedforms.net js.hsforms.net js.hsforms.com js-na1.hs-scripts.com forms.hsforms.com',
  childSrc:
    'app.hubspot.com forms.hsforms.com js.hsadspixel.net js.hscollectedforms.net js.usemessages.com js.hsforms.net js.hsforms.com',
  frameAncestors:
    '*.hubspot.com forms.hsforms.com js.hsadspixel.net js.hscollectedforms.net js.usemessages.com'
}

/**
 * @param extendCsp
 * @returns {string}
 */
const getCsp = (extendCsp) => {
  Object.keys(extendCsp).forEach((key) => {
    if (ContentSecurityPolicy[key]) {
      ContentSecurityPolicy[key] += ` ${extendCsp[key]}`
    }
  })
  Object.keys(hubspotCsp).forEach((key) => {
    if (ContentSecurityPolicy[key]) {
      ContentSecurityPolicy[key] += ` ${hubspotCsp[key]}`
    }
  })
  return Object.values(ContentSecurityPolicy).join('; ')
}
module.exports = getCsp
