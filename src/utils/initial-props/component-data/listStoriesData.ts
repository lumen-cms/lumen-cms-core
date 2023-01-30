import { LmStoryblokService } from '../StoryblokService'
import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { getListStoriesParams } from '../../universal/getListStoriesParams'
import { ISbStoriesParams } from 'storyblok-js-client'

export const listStoriesData = async (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const params: ISbStoriesParams = getListStoriesParams(item, pageProps)
  const storiesResult = await LmStoryblokService.getStories(params)
  delete storiesResult.headers
  storiesResult.data.rels = []
  storiesResult.data.links = []
  return storiesResult
}
