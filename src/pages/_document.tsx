export { default } from '../components/pages/_document'

// to test shopify enable it
import { getShopifyPageProps } from '../components/ecommerce/shopify/lib/getShopifyPageProps'
import { SSR_CONFIG } from '../utils/initial-props/ssrConfig'

SSR_CONFIG.ssrHooks.pageProps.push(getShopifyPageProps)
