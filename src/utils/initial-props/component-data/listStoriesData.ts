import { StoriesParams } from 'storyblok-js-client'
import { LmStoryblokService } from '../StoryblokService'
import { ListStoriesStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmListStoriesData } from '../../../components/list-widget/listWidgetTypes'
import { getListStoriesParams } from '../../universal/getListStoriesParams'

export const listStoriesData = async (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const params: StoriesParams = getListStoriesParams(item, pageProps)
  const storiesResult: LmListStoriesData = await LmStoryblokService.get(
    'cdn/stories',
    params
  )
  storiesResult.data.stories.forEach((story) => {
    if (story.content.categories) {
      console.log(story)
    }
  })
  // not in use
  delete storiesResult.headers
  storiesResult.data.rels = []
  storiesResult.data.links = []
  return storiesResult
}
