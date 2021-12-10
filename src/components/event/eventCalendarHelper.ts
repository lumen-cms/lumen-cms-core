import { EventCalendar, LmEventStoryblok } from './eventTypes'
import { StoryData } from 'storyblok-js-client'

const convertDate = (string?: string) =>
  string ? new Date(/*`${string}+0000`*/ string) : undefined

export const parseEventsToCalendar = (
  storyData: StoryData<LmEventStoryblok>[]
) => {
  const multiEvents: EventCalendar[] = []
  const eventMap: EventCalendar[] = []
  storyData.forEach(({ content }) => {
    if (
      content.expire_event_date &&
      new Date() >= new Date(content.expire_event_date)
    ) {
      return // don't add any date if expiry is set
    }
    if (content.multiple_event_dates?.length) {
      const [first, ...others] = content.multiple_event_dates
      others.forEach((currentEventData) => {
        multiEvents.push({
          title: currentEventData.title || content.title,
          start: convertDate(currentEventData.start),
          end: convertDate(currentEventData.end),
          allDay: !!currentEventData.all_day,
          resource: content
        })
      })
      eventMap.push({
        title: first.title || content.title,
        start: convertDate(first.start),
        end: convertDate(first.end),
        allDay: first.all_day,
        resource: content
      })
    }
    eventMap.push({
      title: content.title,
      start: convertDate(content.start),
      end: convertDate(content.end),
      allDay: content.all_day,
      resource: content
    })
  })
  return [...eventMap, ...multiEvents]
}
