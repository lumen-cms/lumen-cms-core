import type { RenderContext } from './context'

type Page = RenderContext['page']
export interface PreviewServerData {
 shopify?: { scope: string; products: NonNullable<Page['allShopifyProducts']> }
}

function shopifyScope(page: Page) {
 const config = page.settings?.ecommerce?.find(item => item.component === 'ecommerce_shopify_config')
 return config?.domain ? JSON.stringify([page.page?.uuid, page.settings?.uuid, page.locale, config.domain]) : undefined
}

/** Only public product data, never the page/settings object or API credentials.
 * Large catalogs stay server-side to leave room for the edited story in POSTs. */
export function previewServerData(page: Page): PreviewServerData | undefined {
 const scope = shopifyScope(page)
 if (!page.insideStoryblok || !scope || !page.allShopifyProducts) return
 const data = { shopify: { scope, products: page.allShopifyProducts } }
 return new TextEncoder().encode(JSON.stringify(data)).length <= 128 * 1024 ? data : undefined
}

/** Editor round-trip data is for display only; never use it to authorize a
 * request or calculate a checkout price. Shopify remains authoritative. */
export function previewProducts(page: Page, data?: PreviewServerData) {
 const scope = shopifyScope(page)
 if (scope && data?.shopify?.scope === scope && Array.isArray(data?.shopify?.products)) return data.shopify.products
}
