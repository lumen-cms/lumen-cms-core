import { EventCalendar, LmEventCalendarProps } from './eventTypes'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseEventsToCalendar } from './eventCalendarHelper'
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import LmEvent from './Event'
import { CalendarToolbar } from './EventCalendarToolbar'
import { eventMessages } from './eventMessages'

export default function LmEventCalendar({ content }: LmEventCalendarProps) {
  const locales: any = {}
  if (content.language === 'de') {
    locales.de = require('date-fns/locale/de/index')
  } else if (content.language === 'fr') {
    locales.fr = require('date-fns/locale/fr/index')
  } else if (content.language === 'it') {
    locales.it = require('date-fns/locale/it/index')
  } else if (content.language === 'es') {
    locales.es = require('date-fns/locale/es/index')
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
    ? content.views
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
      <Calendar
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
        defaultView={currentView}
        components={{
          toolbar: CalendarToolbar
        }}
        events={currentEvents}
        onSelectEvent={(event) => {
          setSelectedEvent(event as EventCalendar)
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
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {selectedEvent?.resource && (
          <LmEvent content={selectedEvent.resource} />
        )}
      </Dialog>
    </>
  )
}
