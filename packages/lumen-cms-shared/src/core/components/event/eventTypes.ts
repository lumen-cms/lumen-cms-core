import {
  EventCalendarStoryblok,
  EventCategoryStoryblok,
  EventStoryblok
} from '../../typings/generated/components-schema'
type Event = { title?: string; start?: Date; end?: Date; allDay?: boolean }
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
