import { hasuraGraphqlSdk } from './graphql-request'
import { retryRead } from '../../../server/retryRead'

export async function fetchTravel(slug: string) {
  const { travel } = await retryRead(() => hasuraGraphqlSdk.travelBySlug({ slug }))
  return travel
  // return graphqlRequest(query, { slug }).then((r: any) => r.travel)
}
