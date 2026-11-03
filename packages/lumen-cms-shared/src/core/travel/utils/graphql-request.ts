import type { DocumentNode } from 'graphql'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../typings/generated/hasura-schema'

function getClient() {
  const endpoint =
    process.env.TRAVEL_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_GQL_HOSTNAME
  if (!endpoint)
    throw new Error(
      'TRAVEL_GRAPHQL_ENDPOINT or NEXT_PUBLIC_GQL_HOSTNAME is required for travel requests'
    )
  return new GraphQLClient(endpoint)
}
export default function graphqlRequest(
  queryGql: string | DocumentNode,
  variables: Record<string, unknown> = {}
) {
  return getClient().request(queryGql, variables)
}
export const hasuraGraphqlSdk: ReturnType<typeof getSdk> = {
  allCategories: (...args) => getSdk(getClient()).allCategories(...args),
  allTravels: (...args) => getSdk(getClient()).allTravels(...args),
  travelBySlug: (...args) => getSdk(getClient()).travelBySlug(...args)
}
