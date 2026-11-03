import type { LmEventStoryblok } from '../../../components/event/eventTypes'
import { EventCalendarStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmStoryblokService } from '../StoryblokService'
import { getStoriesDefaultParams } from '../../universal/storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client'

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
  const storyData = await LmStoryblokService.getAll<LmEventStoryblok>(
    'cdn/stories',
    params
  )

  return storyData
}
