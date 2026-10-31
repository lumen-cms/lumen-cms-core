import {
  EventCalendarStoryblok,
  EventCategoryStoryblok,
  EventStoryblok
} from '../../typings/generated/components-schema'
import { Event } from 'react-big-calendar'
import { ISbStoryData } from 'storyblok-js-client'

export type LmEventStoryblok = EventStoryblok & {
  category: ISbStoryData<EventCategoryStoryblok>
}

export type LmEventProps = {
  content: EventStoryblok
}

export type EventCalendar = Omit<Event, 'resource'> & {
  resource: LmEventStoryblok
}
export type LmEventCalendarProps = {
  content: EventCalendarStoryblok & {
    event_calendar_data?: ISbStoryData<LmEventStoryblok>[]
  }
}
