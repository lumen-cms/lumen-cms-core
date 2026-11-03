import { createFastSpringStore, type CommerceUser } from 'lumen-cms-shared/fastspring'
import { loadExternalScript } from './externalScript'
import type { EcommerceFastspringConfigStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { FastSpringData, FastSpringWebhookReceivedData } from 'lumen-cms-shared/core/components/ecommerce/fastspring/fastSpringTypes'

type ProviderWindow = Window & {
 gtag?: (type: string, name: string, data: Record<string, unknown>) => void
 fbq?: (type: string, name: string, data: Record<string, unknown>) => void
 adroll?: { track(name: string, data: Record<string, unknown>): void }
}
let state: ReturnType<typeof createFastSpringStore> | undefined
let ready: Promise<void> | undefined

export function fastSpringStore() {
 const api = window as ProviderWindow
 return state ||= createFastSpringStore({
  builder: { push: payload => window.fastspring.builder.push(payload), checkout: () => window.fastspring.builder.checkout() },
  navigate: path => { window.location.assign(new URL(path, document.baseURI).href) },
  analytics(provider, event, data) {
   if (provider === 'gtag') api.gtag?.('event', event, data)
   else if (provider === 'fbq') api.fbq?.('track', event, data)
   else api.adroll?.track(event, data)
  }
 })
}

export function initializeFastSpringProvider(config: EcommerceFastspringConfigStoryblok, user?: CommerceUser) {
 const store = fastSpringStore()
 store.setUser(user)
 if (ready) return ready
 if (!config.url) return Promise.resolve()
 // Register callbacks before inserting the script: the SDK can invoke them during load.
 window.fscDataCallback = (data: FastSpringData) => store.receive(data)
 window.fscDataPopupWebhookReceived = (data: FastSpringWebhookReceivedData) => store.purchase(data)
 window.fscDataPopupClosed = data => store.closed(data)
 ready = loadExternalScript(config.url, {
  id: 'fsc-api', 'data-storefront': config.data_storefront || '', 'data-access-key': config.data_accesss_key || '',
  'data-data-callback': 'fscDataCallback', 'data-continuous': 'true',
  'data-popup-closed': 'fscDataPopupClosed', 'data-popup-webhook-received': 'fscDataPopupWebhookReceived'
 }).catch(error => { ready = undefined; throw error })
 return ready
}
