import type { EventCalendarStoryblok, EventStoryblok, EventCategoryStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'

export type CalendarView = 'month' | 'week' | 'day' | 'agenda'
export type CalendarResource = EventStoryblok & { category?: { content: EventCategoryStoryblok } }
export interface CalendarEvent {
 title?: string
 start?: Date
 end?: Date
 allDay?: boolean
 resource: CalendarResource
}
export function calendarEvents(stories: { content: CalendarResource }[], now = new Date()): CalendarEvent[] {
 const main: CalendarEvent[] = [], additional: CalendarEvent[] = []
 const date = (value?: string) => value ? new Date(value) : undefined
 for (const { content } of stories) {
  if (content.expire_event_date && now >= new Date(content.expire_event_date)) continue
  const occurrence = (value: NonNullable<EventStoryblok['multiple_event_dates']>[number], extra: boolean): CalendarEvent => ({ title: value.title || content.title, start: date(value.start), end: date(value.end), allDay: extra ? !!value.all_day : value.all_day, resource: content })
  if (content.multiple_event_dates?.length) {
   const [first, ...rest] = content.multiple_event_dates
   main.push(occurrence(first, false))
   additional.push(...rest.map(value => occurrence(value, true)))
  }
  // The legacy renderer also includes the parent occurrence when extra dates exist.
  main.push({ title: content.title, start: date(content.start), end: date(content.end), allDay: content.all_day, resource: content })
 }
 return [...main, ...additional]
}
export function calendarViews(content: Pick<EventCalendarStoryblok, 'view' | 'views'>) {
 const views: CalendarView[] = content.views?.length ? content.views.filter((view): view is CalendarView => !!view) : ['month', 'week', 'day', 'agenda']
 const preferred = content.view || 'month'
 return { views, initialView: views.includes(preferred) ? preferred : views[0] }
}
export function calendarEventColors(event: CalendarEvent) {
 return {
  color: event.resource.color?.rgba || event.resource.category?.content.color?.rgba || undefined,
  backgroundColor: event.resource.background_color?.rgba || event.resource.category?.content.background_color?.rgba || undefined
 }
}
