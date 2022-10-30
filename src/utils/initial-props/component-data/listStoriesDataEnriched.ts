import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { listStoriesData } from './listStoriesData'

export const listStoriesDataEnriched = async (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  return listStoriesData(item, pageProps)
}
