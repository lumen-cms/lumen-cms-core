import { runInNewContext } from 'node:vm'
import { expect, it } from 'vitest'
import { trackingScripts } from '../../packages/lumen-cms-shared/src/tracking'

const settings = { setup_facebook_pixel: 'pixel-one, pixel-two', setup_google_analytics: 'G-FIXTURE', setup_ad_roll_adv_id: 'adv-fixture', setup_ad_roll_pix_id: 'pix-fixture' }
function execute() {
 const plan = trackingScripts(settings, { production: true, gtmContainer: 'GTM-FIXTURE' })
 const inserted: { src?: string }[] = []
 const sandbox: Record<string, any> = { location: { pathname: '/fixture' }, document: {
  createElement: () => ({}),
  getElementsByTagName: () => [{ parentNode: { insertBefore: (script: { src?: string }) => inserted.push(script) } }],
 } }
 sandbox.window = sandbox
 for (const script of plan.scripts) if (script.script_body) runInNewContext(script.script_body, sandbox)
 return { plan, sandbox, inserted }
}
it('excludes every tracker and fallback in development and CMS preview', () => {
 expect(trackingScripts(settings, { production: false, gtmContainer: 'GTM-FIXTURE' })).toEqual({ scripts: [], pixels: [] })
 expect(trackingScripts(settings, { production: true, preview: true, gtmContainer: 'GTM-FIXTURE' })).toEqual({ scripts: [], pixels: [] })
 expect(trackingScripts({}, { production: true })).toEqual({ scripts: [], pixels: [] })
})
it('preserves provider queues, IDs and page-view contracts without network access', () => {
 const { plan, sandbox, inserted } = execute()
 expect(plan.pixels).toEqual(['pixel-one', 'pixel-two'])
 expect(plan.scripts.map(script => script.id)).toEqual(['fbq-init', 'adroll-init', 'gtag-library', 'gtag-init', 'googletagmanager'])
 expect(Array.from(sandbox.fbq.queue, (args: ArrayLike<unknown>) => Array.from(args))).toEqual([['init', 'pixel-one'], ['init', 'pixel-two'], ['track', 'PageView']])
 expect(Array.from(sandbox.dataLayer[1])).toEqual(['config', 'G-FIXTURE', { page_path: '/fixture' }])
 expect(sandbox.dataLayer[2].event).toBe('gtm.js')
 expect(sandbox.adroll_adv_id).toBe('adv-fixture')
 expect(sandbox.adroll_pix_id).toBe('pix-fixture')
 expect(sandbox.adroll[0][0]).toBe('track')
 expect(Array.from(sandbox.adroll[0][1])).toEqual(['pageView'])
 expect(inserted.map(script => script.src)).toEqual(['https://connect.facebook.net/en_US/fbevents.js', 'https://s.adroll.com/j/adv-fixture/roundtrip.js', 'https://www.googletagmanager.com/gtm.js?id=GTM-FIXTURE'])
 expect(plan.scripts.find(script => script.id === 'gtag-library')?.url).toBe('https://www.googletagmanager.com/gtag/js?id=G-FIXTURE')
})
it('keeps CMS values as string data when generating inline JavaScript', () => {
 const id = "G-'quoted'; window.injected=true; //</script>"
 const plan = trackingScripts({ setup_google_analytics: id }, { production: true })
 const sandbox: Record<string, any> = { location: { pathname: '/' } }; sandbox.window = sandbox
 const body = plan.scripts.find(script => script.id === 'gtag-init')!.script_body!
 expect(body).not.toContain('</script>')
 runInNewContext(body, sandbox)
 expect(sandbox.injected).toBeUndefined()
 expect(sandbox.dataLayer[1][1]).toBe(id)
})
it('defers libraries while keeping early conversion events in provider queues', () => {
 const plan = trackingScripts(settings, { production: true, deferLibraries: true, gtmContainer: 'GTM-FIXTURE' })
 const sandbox: Record<string, any> = { location: { pathname: '/landing' }, document: {} }; sandbox.window = sandbox
 for (const script of plan.scripts) if (script.strategy !== 'lazyOnload' && script.script_body) runInNewContext(script.script_body, sandbox)
 // No document/network API is available: initialization must be queue-only.
 runInNewContext("fbq('track','Lead'); gtag('event','generate_lead'); adroll.track('conversion');", sandbox)
 expect(Array.from(sandbox.fbq.queue.at(-1))).toEqual(['track', 'Lead'])
 expect(Array.from(sandbox.dataLayer.at(-1))).toEqual(['event', 'generate_lead'])
 expect(sandbox.adroll.at(-1)[1][0]).toBe('conversion')
 expect(plan.scripts.filter(script => script.url || script.id === 'googletagmanager').every(script => script.strategy === 'lazyOnload')).toBe(true)
})

it('uses the environment GA override once, with CMS fallback for blank overrides', () => {
 const override = trackingScripts(settings, { production: true, googleAnalyticsId: ' G-ENV ', deferLibraries: true })
 expect(override.scripts.filter(script => script.url?.includes('/gtag/js'))).toHaveLength(1)
 expect(override.scripts.find(script => script.id === 'gtag-library')?.url).toContain('id=G-ENV')
 expect(override.scripts.find(script => script.id === 'gtag-init')?.script_body).toContain('"G-ENV"')
 expect(override.scripts.find(script => script.id === 'gtag-init')?.script_body).not.toContain('G-FIXTURE')
 const fallback = trackingScripts(settings, { production: true, googleAnalyticsId: '  ' })
 expect(fallback.scripts.find(script => script.id === 'gtag-library')?.url).toContain('id=G-FIXTURE')
})


it('does not load retired Universal Analytics IDs, while allowing a GA4 environment override', () => {
 const legacy = { setup_google_analytics: ' UA-130347409-1 ' }
 expect(trackingScripts(legacy, { production: true }).scripts).toEqual([])
 const migrated = trackingScripts(legacy, { production: true, googleAnalyticsId: 'G-NEWPROPERTY' })
 expect(migrated.scripts.find(script => script.id === 'gtag-library')?.url).toContain('id=G-NEWPROPERTY')
})


it('sends one explicit initial worker page view with automatic config page views disabled', () => {
 const plan = trackingScripts({setup_google_analytics:'G-WORKER'}, {production:true, explicitPageView:true})
 const sandbox: Record<string, any> = {location:{pathname:'/course'}};sandbox.window=sandbox
 runInNewContext(plan.scripts.find(script => script.id === 'gtag-init')!.script_body!, sandbox)
 const calls = Array.from(sandbox.dataLayer, (args: ArrayLike<unknown>) => Array.from(args))
 expect(calls[1]).toEqual(['config','G-WORKER',{page_path:'/course',send_page_view:false}])
 expect(calls.filter(args => args[0] === 'event')).toEqual([['event','page_view',{page_path:'/course'}]])
})
