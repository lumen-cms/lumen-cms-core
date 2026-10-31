import { EventCalendar, LmEventCalendarProps } from './eventTypes'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import type { Locale } from 'date-fns'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseEventsToCalendar } from './eventCalendarHelper'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { Close } from 'mdi-material-ui'
import LmEvent from './Event'
import { CalendarToolbar } from './EventCalendarToolbar'
import { eventMessages } from './eventMessages'

export default function LmEventCalendar({ content }: LmEventCalendarProps) {
  const locales: Record<string, Locale> = {}
  if (content.language === 'de') {
    locales.de = (
      require('date-fns/locale/de') as typeof import('date-fns/locale/de')
    ).de
  } else if (content.language === 'fr') {
    locales.fr = (
      require('date-fns/locale/fr') as typeof import('date-fns/locale/fr')
    ).fr
  } else if (content.language === 'it') {
    locales.it = (
      require('date-fns/locale/it') as typeof import('date-fns/locale/it')
    ).it
  } else if (content.language === 'es') {
    locales.es = (
      require('date-fns/locale/es') as typeof import('date-fns/locale/es')
    ).es
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })

  const [selectedEvent, setSelectedEvent] = useState<EventCalendar | null>()
  const views = content.views?.length
    ? content.views.filter((view) => view !== '')
    : [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]
  const currentView = views.includes(content.view || Views.MONTH)
    ? content.view || Views.MONTH
    : views[0]

  let [currentEvents] = useState(
    content.event_calendar_data?.length
      ? parseEventsToCalendar(content.event_calendar_data)
      : []
  )
  return (
    <>
      <Calendar<EventCalendar>
        scrollToTime={
          new Date(
            1970,
            1,
            1,
            content.scroll_to_time ? Number(content.scroll_to_time) : 7
          )
        }
        localizer={localizer}
        culture={content.language || 'de'}
        views={views}
        defaultView={!currentView ? undefined : currentView}
        components={{
          toolbar: CalendarToolbar
        }}
        events={currentEvents}
        onSelectEvent={(event) => {
          setSelectedEvent(event)
        }}
        eventPropGetter={(event) => {
          const bgColor =
            event.resource.background_color?.rgba ||
            event.resource.category?.content?.background_color?.rgba
          const color =
            event.resource.color?.rgba ||
            event.resource.category?.content?.color?.rgba
          return {
            style: {
              color: color ? color : undefined,
              backgroundColor: bgColor ? bgColor : undefined
            }
          }
        }}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: '100%' }}
        messages={eventMessages}
      />
      <Dialog
        fullScreen
        onClose={() => {
          setSelectedEvent(null)
        }}
        open={!!selectedEvent}
      >
        <DialogTitle style={{ alignSelf: 'flex-end' }}>
          <IconButton
            onClick={() => {
              setSelectedEvent(null)
            }}
            size="large"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {selectedEvent?.resource && (
          <div style={{ overflowY: 'auto' }}>
            <LmEvent content={selectedEvent.resource} />
          </div>
        )}
      </Dialog>
    </>
  )
}
