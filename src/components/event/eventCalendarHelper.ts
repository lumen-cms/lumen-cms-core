import { EventCalendar, LmEventStoryblok } from './eventTypes'
import { StoryData } from 'storyblok-js-client'

const convertDate = (string?: string) =>
  string ? new Date(/*`${string}+0000`*/ string) : undefined

export const parseEventsToCalendar = (
  storyData: StoryData<LmEventStoryblok>[]
) => {
  const multiEvents: EventCalendar[] = []
  const eventMap: EventCalendar[] = storyData.map((data) => {
    if (data.content.multiple_event_dates?.length) {
      const [first, ...others] = data.content.multiple_event_dates
      others.forEach((currentEventData) => {
        multiEvents.push({
          title: currentEventData.title || data.content.title,
          start: convertDate(currentEventData.start),
          end: convertDate(currentEventData.end),
          allDay: !!currentEventData.all_day,
          resource: data.content
        })
      })
      return {
        title: first.title || data.content.title,
        start: convertDate(first.start),
        end: convertDate(first.end),
        allDay: first.all_day,
        resource: data.content
      }
    }
    return {
      title: data.content.title,
      start: convertDate(data.content.start),
      end: convertDate(data.content.end),
      allDay: data.content.all_day,
      resource: data.content
    }
  })
  return [...eventMap, ...multiEvents]
}
