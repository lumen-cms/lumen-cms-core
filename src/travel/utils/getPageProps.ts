import { TravelListWidgetProps } from '../components/travel-list/TravelListWidget'
import { travelFilterOnCategories } from '../components/travel-list/travelFilterOnCategories'
import { AppPageProps } from '../../typings/app'
import { fetchTravels } from './travels'

export const getTravelListData = async (
  item: TravelListWidgetProps,
  props: AppPageProps
) => {
  item = item || {}
  const travels = await fetchTravels(
    props.locale || props.defaultLocale || 'en'
  )

  const filtered = travelFilterOnCategories(travels, {
    country: item.filter_country,
    city: item.filter_city,
    branch: item.filter_branch,
    travelType: item.filter_travel_type
  })

  if (item.max_number) {
    return filtered.slice(0, Number(item.max_number))
  }

  return filtered
}
