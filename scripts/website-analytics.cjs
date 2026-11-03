// Visual captures must not record visits/conversions in consumer analytics.
const domains = [
  'google-analytics.com', 'googletagmanager.com', 'analytics.google.com',
  'doubleclick.net', 'googleadservices.com', 'adroll.com',
  'connect.facebook.net'
]
function isAnalyticsRequest(input) {
  const url = new URL(input)
  const host = url.hostname.toLowerCase()
  return domains.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
    ((host === 'facebook.com' || host.endsWith('.facebook.com')) && /^\/tr\/?$/.test(url.pathname))
}
module.exports = { isAnalyticsRequest }
