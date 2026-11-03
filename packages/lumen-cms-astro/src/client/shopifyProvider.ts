import { createShopifyStore } from 'lumen-cms-shared/shopify'
import type { EcommerceShopifyConfigStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'

type AnalyticsWindow = Window & {
 gtag?: (type: string, event: string, data: Record<string, unknown>) => void
 fbq?: (type: string, event: string, data: Record<string, unknown>) => void
}
let store: ReturnType<typeof createShopifyStore> | undefined
let currentConfig: EcommerceShopifyConfigStoryblok | undefined

export function initializeShopifyProvider(config: EcommerceShopifyConfigStoryblok) {
 currentConfig = config
 const api = window as AnalyticsWindow
 return store ||= createShopifyStore({
  async createCheckout(input) {
   // Resolve public defaults on the server; never read server env in the browser.
   if (!currentConfig?.domain || !currentConfig.access_token) throw new Error('Shopify storefront configuration is missing')
   // Capture this checkout's config before awaiting the code split; preview updates
   // may initialize a different storefront while the chunk is loading.
   const { domain, access_token: accessToken } = currentConfig
   const { shopifyGraphqlSdk } = await import('lumen-cms-shared/core/components/ecommerce/shopify/lib/shopify-graphql-request')
   const { checkoutCreate } = await shopifyGraphqlSdk({ domain, accessToken }).checkoutCreate({ input })
   return checkoutCreate?.checkout
  },
  navigate(url) {
   const anchor = document.createElement('a')
   // Preserve the existing checkout link assignment, including an absent SDK URL.
   anchor.href = url as string; anchor.hidden = true
   document.body.append(anchor); anchor.click(); anchor.remove()
  },
  analytics(provider, event, data) {
   if (provider === 'gtag') api.gtag?.('event', event, data)
   else api.fbq?.('track', event, data)
  }
 })
}
export function shopifyStore() {
 if (!store) throw new Error('Shopify provider has not been initialized')
 return store
}
