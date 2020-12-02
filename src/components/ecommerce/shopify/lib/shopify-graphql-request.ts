import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../../../../typings/generated/shopify-schema'

const shopifyClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_SHOPIFY_GQL as string,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env
        .NEXT_PUBLIC_SHOPIFY_GQL_AUTH as string
    }
  }
)

export const shopifyGraphqlSdk = getSdk(shopifyClient)
