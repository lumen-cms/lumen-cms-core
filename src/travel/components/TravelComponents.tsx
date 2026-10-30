import dynamic from 'next/dynamic'
import { LmCoreComponents } from '../../utils/config'
import { PageContextProvider } from './page/PageContextProvider'

const TravelListWidget = dynamic(() => import('./travel-list/TravelListWidget'))
const TravelSearchBox = dynamic(() => import('./travel-list/TravelSearchBox'))
const Travel = dynamic(() => import('./travel/Travel'))

export function registerTravelComponents() {
  Object.assign(LmCoreComponents, {
    travels_list_widget: TravelListWidget,
    travels_search_box: TravelSearchBox,
    travel: Travel
  })
  if (!LmCoreComponents.lm_app_providers.includes(PageContextProvider)) {
    LmCoreComponents.lm_app_providers.push(PageContextProvider)
  }
}
