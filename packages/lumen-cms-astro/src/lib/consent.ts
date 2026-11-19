import type { CmsScript } from 'lumen-cms-shared/scripts'

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'
export interface ConsentChoice { analytics: boolean; marketing: boolean }
export interface ConsentRecord extends ConsentChoice { version: 1; savedAt: number }
export const CONSENT_KEY = 'lumen-consent-v1'
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60

export function parseConsent(value: string | null, now = Date.now()): ConsentRecord | undefined {
 try {
  const record = JSON.parse(value || 'null')
  if (record?.version === 1 && typeof record.analytics === 'boolean' && typeof record.marketing === 'boolean'
   && typeof record.savedAt === 'number' && record.savedAt <= now && now - record.savedAt < CONSENT_MAX_AGE * 1000) return record
 } catch { /* Corrupt or outdated choices never grant consent. */ }
}

/** CMS scripts are blocked by default, including beforeInteractive scripts. */
export function scriptConsentCategory(script: CmsScript): ConsentCategory {
 if (script.id === 'gtag-init' || script.id === 'gtag-library') return 'analytics'
 if (/^(fbq|adroll)-(init|library)$/.test(script.id)) return 'marketing'
 const category = script.attributes['data-consent-category']
 return category === 'necessary' || category === 'analytics' ? category : 'marketing'
}

/** Empty placeholders and essential-only sites do not need a consent prompt. */
export function requiresConsent(scripts: CmsScript[], speedInsights = false) {
 return speedInsights || scripts.some(script =>
  !!(script.src?.trim() || script.body?.trim()) && scriptConsentCategory(script) !== 'necessary')
}

export function googleConsent(choice: ConsentChoice) {
 return {
  analytics_storage: choice.analytics ? 'granted' : 'denied',
  ad_storage: choice.marketing ? 'granted' : 'denied',
  ad_user_data: choice.marketing ? 'granted' : 'denied',
  ad_personalization: choice.marketing ? 'granted' : 'denied',
 }
}
