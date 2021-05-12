import { AppPageProps } from '../../../../typings/app'
import { shopifyGraphqlSdk } from './shopify-graphql-request'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'

export const getShopifyPageProps = async (props: AppPageProps) => {
  if (!props.page) {
    return // no page found
  }
  const shopifyConfig: EcommerceShopifyConfigStoryblok | undefined = (
    props.settings?.ecommerce || []
  ).find(
    (i) => i.component === 'ecommerce_shopify_config'
  ) as EcommerceShopifyConfigStoryblok
  const { products } = await shopifyGraphqlSdk({
    domain: shopifyConfig?.domain,
    accessToken: shopifyConfig?.access_token
  }).allProducts()
  Object.assign(props, {
    allShopifyProducts: products.edges
  })
}
