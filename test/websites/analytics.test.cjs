const { test } = require('node:test')
const assert = require('node:assert/strict')
const { isAnalyticsRequest } = require('../../scripts/website-analytics.cjs')

test('visual captures suppress configured analytics providers and pixel beacons', () => {
  for (const url of [
    'https://www.googletagmanager.com/gtm.js?id=test',
    'https://www.googletagmanager.com/gtag/js?id=test',
    'https://region1.google-analytics.com/g/collect',
    'https://connect.facebook.net/en_US/fbevents.js',
    'https://www.facebook.com/tr/?id=test&ev=PageView',
    'https://s.adroll.com/j/test/roundtrip.js',
    'https://d.adroll.com/cm',
    'https://stats.g.doubleclick.net/g/collect'
  ]) assert.equal(isAnalyticsRequest(url), true, url)
})
test('analytics isolation preserves CMS images, page content and Facebook embeds', () => {
  for (const url of [
    'https://a.storyblok.com/f/123/image.jpg',
    'https://baliinternships.com/training',
    'https://www.facebook.com/plugins/page.php',
    'https://google-analytics.com.example.org/image.png',
    'http://127.0.0.1:4321/gtag.js'
  ]) assert.equal(isAnalyticsRequest(url), false, url)
})
