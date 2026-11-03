import { Calendar } from 'fullcalendar'
import themePlugin from 'fullcalendar/themes/monarch'
import { calendarEvents, calendarViews, calendarEventColors, type CalendarResource, type CalendarView } from 'lumen-cms-shared/calendar'
import type { EventCalendarStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import { initializeDialogs } from './dialog'

const labels: Record<CalendarView, string> = { month: 'Monat', week: 'Woche', day: 'Tag', agenda: 'Liste' }
const viewTypes: Record<CalendarView, string> = { month: 'dayGridMonth', week: 'timeGridWeek', day: 'timeGridDay', agenda: 'lumenAgenda' }
export async function mount(root: HTMLElement, signal: AbortSignal) {
  const config = JSON.parse(root.dataset.lmCalendar!) as EventCalendarStoryblok & { stories: { content: CalendarResource }[]; scope: string }
  const locale = config.language || 'de'
  const { views, initialView } = calendarViews(config)
  const localeLoaders = { de: () => import('fullcalendar/locales/de'), fr: () => import('fullcalendar/locales/fr'), it: () => import('fullcalendar/locales/it'), es: () => import('fullcalendar/locales/es') }
  const [dayGrid, timeGrid, list, translation] = await Promise.all([
   views.includes('month') ? import('fullcalendar/daygrid') : undefined,
   views.some(view => view === 'week' || view === 'day') ? import('fullcalendar/timegrid') : undefined,
   views.includes('agenda') ? import('fullcalendar/list') : undefined,
   localeLoaders[locale as keyof typeof localeLoaders]?.()
  ])
  if (signal.aborted) return
  root.dataset.calendarInitialized = 'true'
  const select = root.querySelector<HTMLSelectElement>('[data-calendar-view]')!
  select.replaceChildren()
  for (const value of views) { const option = document.createElement('option'); option.value = value; option.textContent = labels[value]; select.append(option) }
  select.hidden = views.length < 2
  const events = calendarEvents(config.stories).filter(event => event.start && Number.isFinite(event.start.getTime()))
  const calendar = new Calendar(root.querySelector<HTMLElement>('[data-calendar-body]')!, {
   plugins: [themePlugin, ...[dayGrid, timeGrid, list].flatMap(plugin => plugin ? [plugin.default] : [])],
   locales: translation ? [translation.default] : [], locale,
   firstDay: ['de', 'fr', 'it', 'es'].includes(locale) ? 1 : 0,
   initialView: viewTypes[initialView || 'month'],
   headerToolbar: false, height: '100%', fixedWeekCount: false,
   scrollTime: { hours: Number(config.scroll_to_time || 7) },
   navLinks: views.includes('day'), navLinkDayClick: 'timeGridDay',
   views: { lumenAgenda: { type: 'list', duration: { days: 31 }, dateIncrement: { days: 30 }, dateAlignment: 'day' } },
   events: events.map((event, index) => {
    const colors = calendarEventColors(event)
    return { id: String(index), title: event.title || '', start: event.start!, end: event.end, allDay: event.allDay, color: colors.backgroundColor || '#3174ad', contrastColor: colors.color || '#fff', extendedProps: { resourceUid: event.resource._uid } }
   }),
   datesSet(info) {
    const view = (Object.keys(viewTypes) as CalendarView[]).find(key => viewTypes[key] === info.view.type) || 'month'
    root.dataset.calendarCurrentView = view; select.value = view
    root.querySelector<HTMLElement>('[data-calendar-label]')!.textContent = info.view.title
   },
   eventDidMount(info) {
    const el = info.el as HTMLElement
    el.dataset.lmDialogTrigger = `${config.scope}-${info.event.extendedProps.resourceUid}`
    el.setAttribute('role', 'button'); el.setAttribute('aria-label', info.event.title); el.tabIndex = 0
    el.style.backgroundColor = info.event.color; el.style.color = info.event.contrastColor
    el.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); el.click() } })
    initializeDialogs()
   }
  })
  const listeners = new AbortController()
  root.addEventListener('click', event => {
   const target = event.target instanceof Element ? event.target : undefined
   if (target?.closest('[data-calendar-today]')) calendar.today()
   else if (target?.closest('[data-calendar-prev]')) calendar.prev()
   else if (target?.closest('[data-calendar-next]')) calendar.next()
  }, { signal: listeners.signal })
  select.addEventListener('change', () => calendar.changeView(viewTypes[select.value as CalendarView]), { signal: listeners.signal })
  calendar.render()
  return () => { listeners.abort(); calendar.destroy(); delete root.dataset.calendarInitialized }
}
