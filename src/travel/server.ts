import pagesGetStaticProps from '../utils/initial-props/pagesGetStaticProps'
import { SSR_CONFIG } from '../utils/initial-props/ssrConfig'
import { getTravelListData } from './utils/getPageProps'

export function registerTravelServerHooks() {
  SSR_CONFIG.ssrHooks.componentData.travels_list_widget = getTravelListData
}

// Register after core initializes its registry, in the page's server bundle.
export const travelPagesGetStaticProps: typeof pagesGetStaticProps = (
  context
) => {
  registerTravelServerHooks()
  return pagesGetStaticProps(context)
}
export {
  getStaticPaths as getTravelStaticPaths,
  getStaticProps as getTravelStaticProps
} from './utils/travelProps'
export { getTravelListData }
export { fetchTravel } from './utils/travel'
export { fetchTravels } from './utils/travels'
