import {
  Enum_Language_Enum,
  Travel_Bool_Exp
} from '../typings/generated/hasura-schema'
import { hasuraGraphqlSdk } from './graphql-request'

export const getDefaultCategoryFilter = (
  locale: Enum_Language_Enum
): Travel_Bool_Exp => ({
  language_key: { _eq: locale },
  slug: { _neq: '' },
  published: { _eq: true },
  title: { _neq: '' },
  product_id: { _gte: 1 },
  preview_image_id: { _gte: 1 }
})

export const fetchCategories = (locale: string | null) => {
  let travelFilter = {
    travelFilter: getDefaultCategoryFilter(
      (locale || 'en').toUpperCase() as Enum_Language_Enum
    )
  }
  return hasuraGraphqlSdk.allCategories(travelFilter)
}
