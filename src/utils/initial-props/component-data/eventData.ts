import { EventCalendarStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { StoriesParams } from 'storyblok-js-client'
import { LmStoryblokService } from '../StoryblokService'

export const getEventData = async (
  _item: EventCalendarStoryblok,
  _props: AppPageProps
) => {
  const params: StoriesParams = {
    filter_query: {
      component: {
        in: 'event'
      }
      // 'dates.0.start': {
      //   gt_date: '2021-08-10 00:00'
      // },
      // 'dates.0.end': {
      //   lt_date: '2021-08-22 00:00'
      // }
      /*
      __or: [
        {
          'dates.0.start': {
            gt_date: '2021-08-10 00:00'
          },
          'dates.0.end': {
            lt_date: '2021-08-18 00:00'
          }
        },
        {
          'dates.1.start': {
            gt_date: '2021-08-10 00:00'
          },
          'dates.1.end': {
            lt_date: '2021-08-18 00:00'
          }
        }
      ]*/
    }
  }
  const storyData = await LmStoryblokService.getAll('cdn/stories', params)

  return storyData
}
