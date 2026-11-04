import { expect, it } from 'vitest'
import { isHubspotLoader } from '../../packages/lumen-cms-astro/src/lib/thirdPartyScripts'
it('recognizes regional HubSpot account loaders without matching other resources or lookalike hosts', () => {
 for (const source of ['//js-na1.hs-scripts.com/4063132.js', 'https://js.hs-scripts.com/123.js', 'https://js-eu1.hs-scripts.com/123.js']) expect(isHubspotLoader(source)).toBe(true)
 for (const source of [undefined, 'https://js.hs-scripts.com.evil.test/123.js', 'https://js.hsforms.net/forms/shell.js', '/123.js']) expect(isHubspotLoader(source)).toBe(false)
})
