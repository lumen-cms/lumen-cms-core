import { AppPageProps } from '../../../../typings/app'
import { shopifyGraphqlSdk } from './shopify-graphql-request'

export const getShopifyPageProps = async (props: AppPageProps) => {
  if (!props.page) {
    return // no page found
  }
  const { products } = await shopifyGraphqlSdk.allProducts()
  Object.assign(props, {
    allShopifyProducts: products.edges
  })
}
