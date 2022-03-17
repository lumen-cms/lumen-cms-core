const ContentSecurityPolicy = {
  defaultSrc: `default-src 'self' *.storyblok.com vercel.com *.vercel.com *.stripe.com twitter.com google.com *.google.com *.facebook.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://*.google.com https://*.facebook.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io chrome-extension://*`,
  scriptSrc: `script-src 'self' https://*.studentsgoabroad.com https://*.studentsgoabroad.org *.studentsgoabroad.com *.studentsgoabroad.org *.facebook.com connect.facebook.net *.hubspot.com  *.storyblok.com 'unsafe-eval' 'unsafe-inline' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com *.youtube.com *.youtube-nocookie.com *.ytimg.com *.twimg.com *.zdassets.com cdn.sift.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.ads-twitter.com *.github.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* https://browser.sentry-cdn.com https://js.sentry-cdn.com https://*.sentry.io https://embed.tawk.to https://cdn.jsdelivr.net/emojione/ https://player.vimeo.com https://www.vimeo.com https://f.vimeocdn.com chrome-extension://*`,
  childSrc: `child-src https://*.studentsgoabroad.com https://*.studentsgoabroad.org *.studentsgoabroad.com *.studentsgoabroad.org https://meetings.hubspot.com/ *.facebook.com connect.facebook.net *.youtube.com *.youtube-nocookie.com *.stripe.com www.google.com github.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com *.vimeo.com vimeo.com https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  styleSrc: `style-src 'self' 'unsafe-inline' *.googleapis.com vercel.com *.vercel.com *.stripe.com twitter.com *.twitter.com *.github.com embed.tawk.to https://*.google.com https://*.googletagmanager.com:* wss://*.vercel.com localhost:* chrome-extension://*`,
  imgSrc: `img-src *.vimeocdn.com *.vimeo.com * blob: data:`,
  mediaSrc: `media-src *`,
  connectSrc: `connect-src *`,
  fontSrc: `font-src 'self' embed.tawk.to *.vercel.com *.gstatic.com data:`,
  workerSrc: `worker-src blob:`,
  frameAncestors: `frame-ancestors va.tawk.to https://*.studentsgoabroad.com https://*.studentsgoabroad.org https://*.storyblok.com *.facebook.com connect.facebook.net`
}

const hubspotCsp = {
  scriptSrc:
    'https://js.hs-scripts.com  https://js.hsleadflows.net  https://js.hs-banner.com  https://js.hsadspixel.net  https://js.hubspotfeedback.com  https://js.usemessages.com  https://js.hs-analytics.net  https://js.hscollectedforms.net  https://js.hsforms.net  https://js-na1.hs-scripts.com  https://forms.hsforms.com',
  childSrc:
    'app.hubspot.com forms.hsforms.com js.hsadspixel.net js.hscollectedforms.net js.usemessages.com',
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
      ContentSecurityPolicy[key] += ` ${extendCsp[key]}`
    }
  })
  return Object.values(ContentSecurityPolicy).join('; ')
}
module.exports = getCsp
