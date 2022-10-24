import { LmStoryblokService } from '../StoryblokService'
import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmListStoriesData } from '../../../components/list-widget/listWidgetTypes'
import { getListStoriesParams } from '../../universal/getListStoriesParams'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

export const listStoriesData = async (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const params: ISbStoriesParams = getListStoriesParams(item, pageProps)
  const storiesResult: LmListStoriesData = await LmStoryblokService.get(
    'cdn/stories',
    params
  )
  // not in use
  delete storiesResult.headers
  storiesResult.data.rels = []
  storiesResult.data.links = []

  return storiesResult
}
