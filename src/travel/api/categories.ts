import { NextApiRequest, NextApiResponse } from 'next'
import { hasuraGraphqlSdk } from '../utils/graphql-request'
import { CategoryStateProp } from '../components/page/pageContextTypes'
import {
  Enum_Language_Enum,
  Travel_Bool_Exp
} from '../typings/generated/hasura-schema'
import { getDefaultCategoryFilter } from '../utils/categories'

const apiFetchCategories = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const options: CategoryStateProp = req.query

  const locale =
    options.locale ||
    (typeof req.query.__nextLocale === 'string'
      ? req.query.__nextLocale
      : undefined) ||
    (process.env.NEXT_PUBLIC_ROOT_DIRECTORY === 'de' ? 'de' : 'en') ||
    'en'
  const travelFilter: Travel_Bool_Exp = {
    ...getDefaultCategoryFilter(locale.toUpperCase() as Enum_Language_Enum)
  }
  if (options.travelType) {
    travelFilter.mn_travel_travel_types = {
      travel_type_id: {
        _eq: Number(options.travelType)
      }
    }
  }
  if (options.branch) {
    travelFilter.mn_travel_branches = {
      branch_id: {
        _eq: Number(options.branch)
      }
    }
  }
  if (options.city) {
    travelFilter.city_id = {
      _eq: Number(options.city)
    }
  }
  if (options.country) {
    travelFilter.city = {
      country_id: {
        _eq: Number(options.country)
      }
    }
  }

  const categories = await hasuraGraphqlSdk.allCategories({ travelFilter })
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(categories)
}
export default apiFetchCategories
