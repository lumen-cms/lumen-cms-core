import { IncomingMessage, ServerResponse } from 'http'
import { useMemo } from 'react'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export type ResolverContext = {
  req?: IncomingMessage
  res?: ServerResponse
}

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_GQL_AUTH
//     }
//   }
// })

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SHOPIFY_GQL,
  headers: {
    'X-Shopify-Storefront-Access-Token':
      process.env.NEXT_PUBLIC_SHOPIFY_GQL_AUTH
  }
})

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    link: httpLink,
    cache: new InMemoryCache()
  })
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
