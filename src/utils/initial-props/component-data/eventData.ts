import { EventCalendarStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmStoryblokService } from '../StoryblokService'
import { getStoriesDefaultParams } from '../../universal/storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

export const getEventData = async (
  _item: EventCalendarStoryblok,
  props: AppPageProps
) => {
  const params: ISbStoriesParams = {
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
