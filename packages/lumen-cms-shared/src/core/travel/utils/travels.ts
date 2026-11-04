import { hasuraGraphqlSdk } from './graphql-request'
import { Enum_Language_Enum } from '../typings/generated/hasura-schema'
import { retryRead } from '../../../server/retryRead'

export async function fetchTravels(locale: string = 'en') {
  const { travel } = await retryRead(() => hasuraGraphqlSdk.allTravels({
    locale: locale?.toUpperCase() as Enum_Language_Enum
  }))
  return travel
}
