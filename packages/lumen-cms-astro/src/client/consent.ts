import { CONSENT_KEY, CONSENT_MAX_AGE, googleConsent, parseConsent, type ConsentCategory, type ConsentChoice, type ConsentRecord } from '../lib/consent'
import { onUnmount } from './lifecycle'

const denied: ConsentChoice = { analytics: false, marketing: false }
let current: ConsentRecord | undefined
let initialized = false
let googleInitialized = false
let reloading = false
let expiryTimer: ReturnType<typeof setTimeout> | undefined
type TrackingWindow = Window & {
 dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void
}

export function consentEnabled() { return document.documentElement.dataset.lumenConsent === 'basic' }
export function readConsent() {
 const cookie = document.cookie.split('; ').find(item => item.startsWith(`${CONSENT_KEY}=`))
 try { return parseConsent(cookie ? decodeURIComponent(cookie.slice(CONSENT_KEY.length + 1)) : null) } catch { return undefined }
}
export function hasConsent(category: ConsentCategory) {
 if (reloading) return false
 if (!consentEnabled() || category === 'necessary') return true
 const choice = current ? parseConsent(JSON.stringify(current)) : readConsent()
 return choice?.[category] === true
}

/** Install the Google queue only after Analytics consent, before config/events. */
export function prepareGoogleConsent() {
 if (!consentEnabled() || googleInitialized || !hasConsent('analytics')) return
 const api = window as TrackingWindow
 api.dataLayer ||= []
 api.gtag ||= function () { api.dataLayer!.push(arguments) }
 api.gtag('consent', 'default', googleConsent(denied))
 api.gtag('consent', 'update', googleConsent(current || readConsent() || denied))
 googleInitialized = true
}

function clearTrackingCookies() {
 const domains = location.hostname.split('.').map((_, index, parts) => parts.slice(index).join('.'))
 const paths = ['/', ...location.pathname.split('/').slice(1).map((_, index, parts) => '/' + parts.slice(0, index + 1).join('/'))]
 for (const cookie of document.cookie.split(';')) {
  const name = cookie.split('=')[0].trim()
  if (!/^(_ga(?:_|$)|_gid$|_gat|_gcl_|_fbp$|_fbc$|__adroll|adroll|__ar_v4$)/.test(name)) continue
  for (const path of paths) for (const domain of ['', ...domains]) {
   document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}${domain ? `; Domain=${domain}` : ''}`
  }
 }
}

function applyChoice(next: ConsentRecord | undefined) {
 const previous = current || denied
 current = next
 scheduleExpiry()
 const choice = next || denied
 if ((previous.analytics && !choice.analytics) || (previous.marketing && !choice.marketing)) {
  // Arbitrary CMS trackers cannot reliably be unloaded. Disable known vendors,
  // persist the new choice first, then replace the document to stop all SDKs.
  reloading = true
  const api = window as TrackingWindow
  for (const script of document.querySelectorAll<HTMLScriptElement>('script[src*="/gtag/js"]')) {
   const id = new URL(script.src).searchParams.get('id')
   if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true
  }
  api.fbq?.('consent', 'revoke')
  clearTrackingCookies()
  window.location.reload()
  return
 }
 if (googleInitialized) (window as TrackingWindow).gtag?.('consent', 'update', googleConsent(choice))
 document.dispatchEvent(new CustomEvent('lumen:consent-change', { detail: { ...choice } }))
}

function scheduleExpiry() {
 clearTimeout(expiryTimer)
 if (!current) return
 const remaining = current.savedAt + CONSENT_MAX_AGE * 1000 - Date.now()
 expiryTimer = setTimeout(() => {
  if (current && Date.now() - current.savedAt >= CONSENT_MAX_AGE * 1000) applyChoice(undefined)
  else scheduleExpiry()
 }, Math.max(0, Math.min(remaining, 2_147_483_647)))
}

export function saveConsent(choice: ConsentChoice) {
 const next: ConsentRecord = { version: 1, savedAt: Date.now(), analytics: choice.analytics, marketing: choice.marketing }
 document.cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify(next))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
 // Cookies are the source of truth; storage is only a cross-tab notification.
 try { localStorage.setItem(CONSENT_KEY, JSON.stringify(next)) } catch { /* Consent still works without storage. */ }
 applyChoice(next)
}

export function initializeConsent() {
 if (!consentEnabled()) return
 if (!initialized) {
  initialized = true
  current = readConsent()
  scheduleExpiry()
  window.addEventListener('storage', event => {
   if (event.key === CONSENT_KEY || event.key === null) applyChoice(readConsent())
  })
  // A restored page must not resume trackers after consent changed in another tab.
  window.addEventListener('pageshow', event => { if (event.persisted) applyChoice(readConsent()) })
  window.addEventListener('focus', () => applyChoice(readConsent()))
 }
 const root = document.querySelector<HTMLElement>('[data-lm-consent]')
 if (!root || root.dataset.ready) return
 root.dataset.ready = 'true'
 const dialog = root.querySelector<HTMLDialogElement>('dialog')!
 const analytics = root.querySelector<HTMLInputElement>('[name="consent-analytics"]')!
 const marketing = root.querySelector<HTMLInputElement>('[name="consent-marketing"]')!
 const launcher = root.querySelector<HTMLButtonElement>('[data-consent-open]')!
 const banner = root.querySelector<HTMLElement>('[data-consent-banner]')!
 const customize = root.querySelector<HTMLButtonElement>('[data-consent-customize]')!
 const updateVisibility = () => {
  banner.hidden = !!current || dialog.open
  launcher.hidden = !current || dialog.open
 }
 const sync = () => {
  analytics.checked = current?.analytics || false
  marketing.checked = current?.marketing || false
 }
 const open = () => { sync(); dialog.showModal(); updateVisibility() }
 const close = () => { dialog.close() }
 dialog.addEventListener('close', () => {
  updateVisibility()
  ;(current ? launcher : customize).focus({ preventScroll: true })
 })
 const choose = (choice: ConsentChoice) => {
  saveConsent(choice)
  if (dialog.open) close()
  else { updateVisibility(); launcher.focus({ preventScroll: true }) }
 }
 root.hidden = false
 launcher.addEventListener('click', open)
 customize.addEventListener('click', open)
 root.querySelector('[data-consent-close]')!.addEventListener('click', close)
 root.querySelectorAll('[data-consent-reject]').forEach(button => button.addEventListener('click', () => choose(denied)))
 root.querySelectorAll('[data-consent-accept]').forEach(button => button.addEventListener('click', () => choose({ analytics: true, marketing: true })))
 root.querySelector('form')!.addEventListener('submit', event => {
  event.preventDefault(); choose({ analytics: analytics.checked, marketing: marketing.checked })
 })
 document.addEventListener('lumen:consent-change', updateVisibility)
 onUnmount(root, () => document.removeEventListener('lumen:consent-change', updateVisibility))
 updateVisibility()
}
