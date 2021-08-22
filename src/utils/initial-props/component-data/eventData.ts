import { EventCalendarStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { StoriesParams } from 'storyblok-js-client'
import { LmStoryblokService } from '../StoryblokService'
import { getStoriesDefaultParams } from '../../universal/storyblokParamsHelper'

export const getEventData = async (
  _item: EventCalendarStoryblok,
  props: AppPageProps
) => {
  const params: StoriesParams = {
    ...getStoriesDefaultParams(props),
    filter_query: {
      component: {
        in: 'event'
      }
    }
  }
  const storyData = await LmStoryblokService.getAll('cdn/stories', params)

  return storyData
}
