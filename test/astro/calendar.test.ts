import { describe, expect, it } from 'vitest'
import { calendarEvents, calendarViews, calendarEventColors, type CalendarResource } from '../../packages/lumen-cms-shared/src/calendar'
import { parseEventsToCalendar } from '../../src/components/event/eventCalendarHelper'

const resource = (values: Partial<CalendarResource> = {}): CalendarResource => ({ component: 'event', _uid: 'event', title: 'Parent event', start: '2026-11-02T10:00:00', end: '2026-11-02T11:00:00', ...values })
describe('native calendar data', () => {
 it('preserves legacy parent/extra occurrence ordering and title fallback', () => {
  const stories = [{ content: resource({ multiple_event_dates: [{ component: 'event_date', _uid: 'one', start: '2026-11-03T10:00:00', title: 'First' }, { component: 'event_date', _uid: 'two', start: '2026-11-04T10:00:00', all_day: true }] }) }, { content: resource({ _uid: 'second', title: 'Second event' }) }]
  expect(calendarEvents(stories)).toEqual(parseEventsToCalendar(stories as Parameters<typeof parseEventsToCalendar>[0]))
  expect(calendarEvents(stories).map(event => event.title)).toEqual(['First', 'Parent event', 'Second event', 'Parent event'])
 })
 it('excludes expired events at the exact boundary and keeps future expiry', () => {
  const now = new Date('2026-11-02T10:00:00')
  expect(calendarEvents([{ content: resource({ expire_event_date: '2026-11-02T10:00:00' }) }], now)).toEqual([])
  expect(calendarEvents([{ content: resource({ expire_event_date: '2026-11-02T10:00:01' }) }], now)).toHaveLength(1)
 })
 it('retains configured view fallback and filters empty view values', () => {
  expect(calendarViews({})).toEqual({ views: ['month', 'week', 'day', 'agenda'], initialView: 'month' })
  expect(calendarViews({ views: ['', 'day', 'agenda'], view: 'week' })).toEqual({ views: ['day', 'agenda'], initialView: 'day' })
 })
 it('prefers event colors over category colors', () => {
  const item = resource({ color: { rgba: 'red' }, category: { content: { component: 'event_category', _uid: 'category', color: { rgba: 'green' }, background_color: { rgba: 'blue' } } } })
  expect(calendarEventColors(calendarEvents([{ content: item }])[0])).toEqual({ color: 'red', backgroundColor: 'blue' })
 })
})
