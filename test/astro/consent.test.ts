// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CONSENT_KEY, CONSENT_MAX_AGE, parseConsent, scriptConsentCategory, requiresConsent } from '../../packages/lumen-cms-astro/src/lib/consent'
import { consentMessages, getConsentMessages } from '../../packages/lumen-cms-astro/src/lib/consentMessages'
import type { CmsScript } from '../../packages/lumen-cms-shared/src/scripts'

const entry = (id: string, attributes = {}): CmsScript => ({ id, strategy: 'afterInteractive', attributes, body: '' })

it('prompts only for actual optional scripts or explicitly enabled performance analytics', () => {
 expect(requiresConsent([])).toBe(false)
 expect(requiresConsent([entry('empty'), { ...entry('blank'), body: '  ', src: ' ' }])).toBe(false)
 expect(requiresConsent([{ ...entry('essential', { 'data-consent-category': 'necessary' }), src: '/functional.js' }])).toBe(false)
 for (const id of ['gtag-library', 'fbq-library', 'adroll-library', 'custom-cms']) {
  expect(requiresConsent([{ ...entry(id), src: '/tracker.js' }])).toBe(true)
 }
 expect(requiresConsent([{ ...entry('inline-cms'), body: 'window.track()' }])).toBe(true)
 expect(requiresConsent([], true)).toBe(true)
})
let consent: typeof import('../../packages/lumen-cms-astro/src/client/consent')
let scripts: typeof import('../../packages/lumen-cms-astro/src/client/cmsScripts')
let appended: HTMLScriptElement[]
beforeEach(async () => {
 vi.resetModules(); vi.useFakeTimers()
 document.documentElement.dataset.lumenConsent = 'basic'
 document.cookie = `${CONSENT_KEY}=; Max-Age=0; Path=/`
 localStorage.clear()
 for (const key of ['gtag', 'fbq', 'dataLayer']) delete (window as any)[key]
 consent = await import('../../packages/lumen-cms-astro/src/client/consent')
 scripts = await import('../../packages/lumen-cms-astro/src/client/cmsScripts')
 appended = []
 vi.spyOn(document.body, 'append').mockImplementation((...nodes) => { appended.push(...nodes.filter(node => node instanceof HTMLScriptElement) as HTMLScriptElement[]) })
})
afterEach(() => {
 vi.clearAllTimers(); vi.useRealTimers()
 document.head.replaceChildren(); document.body.replaceChildren()
 delete document.documentElement.dataset.lumenConsent
 document.cookie = `${CONSENT_KEY}=; Max-Age=0; Path=/`
})
const configure = (entries: CmsScript[]) => {
 const config = document.createElement('script')
 config.type = 'application/json'; config.dataset.lmCmsScripts = ''; config.textContent = JSON.stringify(entries)
 document.head.append(config)
}

it('fails closed for corrupt, expired, future, old-version and incomplete consent', () => {
 const valid = { version: 1, savedAt: Date.now(), analytics: true, marketing: false }
 expect(parseConsent(JSON.stringify(valid))).toEqual(valid)
 for (const value of ['bad', 'null', '{}', JSON.stringify({ ...valid, version: 0 }), JSON.stringify({ ...valid, marketing: 'true' }), JSON.stringify({ ...valid, savedAt: Date.now() + 1000 }), JSON.stringify({ ...valid, savedAt: Date.now() - CONSENT_MAX_AGE * 1000 })]) expect(parseConsent(value)).toBeUndefined()
})

it('classifies generated vendors and defaults unclassified CMS scripts to marketing', () => {
 expect(scriptConsentCategory(entry('gtag-init', { 'data-consent-category': 'necessary' }))).toBe('analytics')
 for (const id of ['fbq-init', 'adroll-library']) expect(scriptConsentCategory(entry(id))).toBe('marketing')
 expect(scriptConsentCategory(entry('cms'))).toBe('marketing')
 expect(scriptConsentCategory(entry('cms', { 'data-consent-category': 'invalid' }))).toBe('marketing')
 expect(scriptConsentCategory(entry('cms', { 'data-consent-category': 'analytics' }))).toBe('analytics')
 expect(scriptConsentCategory(entry('cms', { 'data-consent-category': 'necessary' }))).toBe('necessary')
})

it('blocks queues and all optional scripts before consent, including beforeInteractive', () => {
 configure([entry('gtag-init'), entry('fbq-init'), { ...entry('cms'), strategy: 'beforeInteractive' }, entry('functional', { 'data-consent-category': 'necessary' })])
 scripts.initializeCmsScripts()
 expect(appended.map(script => script.id)).toEqual(['functional'])
 expect((window as any).gtag).toBeUndefined()
 expect((window as any).dataLayer).toBeUndefined()
 consent.saveConsent({ analytics: false, marketing: false })
 scripts.initializeCmsScripts()
 expect(appended.map(script => script.id)).toEqual(['functional'])
})

it('allows analytics independently, queues consent before GA init, and deduplicates subsequent grants', () => {
 configure([entry('gtag-init'), entry('fbq-init'), entry('adroll-init'), entry('cms'), entry('analytics-cms', { 'data-consent-category': 'analytics' })])
 consent.saveConsent({ analytics: true, marketing: false })
 scripts.initializeCmsScripts(); scripts.initializeCmsScripts()
 expect(appended.map(script => script.id)).toEqual(['gtag-init', 'analytics-cms'])
 expect(Array.from((window as any).dataLayer, (args: any) => [...args])).toEqual([
  ['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }],
  ['consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }],
 ])
 consent.saveConsent({ analytics: true, marketing: true }); scripts.initializeCmsScripts()
 expect(appended.map(script => script.id)).toEqual(['gtag-init', 'analytics-cms', 'fbq-init', 'adroll-init', 'cms'])
 expect(consent.readConsent()).toMatchObject({ analytics: true, marketing: true, version: 1 })
})

it('allows marketing without loading Google Analytics', () => {
 configure([entry('gtag-init'), entry('fbq-init'), entry('adroll-init')])
 consent.saveConsent({ analytics: false, marketing: true }); scripts.initializeCmsScripts()
 expect(appended.map(script => script.id)).toEqual(['fbq-init', 'adroll-init'])
 expect((window as any).dataLayer).toBeUndefined()
})

it('reloads on withdrawal and cancels scripts still waiting for idle', async () => {
 const reload = vi.spyOn(window.location, 'reload').mockImplementation(() => {})
 vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
 vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
 const idle = vi.fn(); vi.stubGlobal('requestIdleCallback', idle)
 configure([{ ...entry('gtag-library'), strategy: 'lazyOnload', src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST' }])
 consent.saveConsent({ analytics: true, marketing: false }); scripts.initializeCmsScripts()
 await vi.advanceTimersByTimeAsync(0)
 expect(idle).toHaveBeenCalledOnce()
 document.cookie = '_ga=fixture; Path=/'
 consent.saveConsent({ analytics: false, marketing: false })
 idle.mock.calls[0][0]()
 expect(appended).toHaveLength(0)
 expect(reload).toHaveBeenCalledOnce()
 expect(document.cookie).not.toContain('_ga=')
 expect(consent.readConsent()?.analytics).toBe(false)
})

it('uses saved consent on a fresh document and bypasses gating without the Basic marker', () => {
 document.cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify({ version: 1, savedAt: Date.now(), analytics: true, marketing: false }))}; Path=/`
 expect(consent.hasConsent('analytics')).toBe(true)
 expect(consent.hasConsent('marketing')).toBe(false)
 delete document.documentElement.dataset.lumenConsent
 configure([entry('gtag-init'), entry('cms')]); scripts.initializeCmsScripts()
 expect(appended).toHaveLength(2)
 expect((window as any).dataLayer).toBeUndefined()
})

it('provides complete translations for configured and requested locales with regional fallback', () => {
 expect(Object.keys(consentMessages).sort()).toEqual(['de', 'en', 'es', 'fr', 'id', 'it', 'nl'])
 for (const messages of Object.values(consentMessages)) {
  expect(Object.keys(messages)).toEqual(Object.keys(consentMessages.en))
  expect(Object.values(messages).every(value => value.length > 0)).toBe(true)
 }
 expect(getConsentMessages('de-DE')).toBe(consentMessages.de)
 expect(getConsentMessages('nl_NL')).toBe(consentMessages.nl)
 expect(getConsentMessages('unknown')).toBe(consentMessages.en)
})
