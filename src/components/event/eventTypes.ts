import {
  EventCalendarStoryblok,
  EventCategoryStoryblok,
  EventStoryblok
} from '../../typings/generated/components-schema'
import { Event } from 'react-big-calendar'
import { StoryData } from 'storyblok-js-client'

type LmEventStoryblok = EventStoryblok & {
  category: StoryData<EventCategoryStoryblok>
}

export type LmEventProps = {
  content: LmEventStoryblok
}

export type EventCalendar = Event & {
  resource: LmEventStoryblok
}
export type LmEventCalendarProps = {
  content: EventCalendarStoryblok & {
    event_calendar_data: StoryData<LmEventStoryblok>[]
  }
}
