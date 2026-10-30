import { hasuraGraphqlSdk } from './graphql-request'

export async function fetchTravel(slug: string) {
  const { travel } = await hasuraGraphqlSdk.travelBySlug({ slug })
  return travel
  // return graphqlRequest(query, { slug }).then((r: any) => r.travel)
}
