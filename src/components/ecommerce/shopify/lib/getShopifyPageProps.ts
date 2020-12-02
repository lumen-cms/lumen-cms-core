import { initializeApollo } from './shopify-apollo'
import { AllProductsDocument } from '../graphql/allProducts.graphql'
import { AppPageProps } from '../../../../typings/app'

export const getShopifyPageProps = async (props: AppPageProps) => {
  if (!props.page) {
    return // no page found
  }

  const apolloClient = initializeApollo()
  await apolloClient.query({
    query: AllProductsDocument
  })

  Object.assign(props, {
    shopifyApolloState: apolloClient.cache.extract()
  })
}
