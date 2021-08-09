import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../../../../typings/generated/shopify-schema'

type ShopifyGqlContext = {
  domain?: string
  accessToken?: string
}

const shopifyClient = (ctx?: ShopifyGqlContext) =>
  new GraphQLClient(
    (ctx?.domain
      ? `https://${ctx.domain}/api/2021-07/graphql.json`
      : process.env.NEXT_PUBLIC_SHOPIFY_GQL) as string,
    {
      headers: {
        'X-Shopify-Storefront-Access-Token': (ctx?.accessToken ||
          process.env.NEXT_PUBLIC_SHOPIFY_GQL_AUTH) as string
      }
    }
  )

export const shopifyGraphqlSdk = (ctx?: ShopifyGqlContext) =>
  getSdk(shopifyClient(ctx))
