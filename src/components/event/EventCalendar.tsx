import { EventCalendar, LmEventCalendarProps } from './eventTypes'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { de } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseEventsToCalendar } from './eventCalendarHelper'
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import LmEvent from './Event'

const locales = {
  de
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

export default function LmEventCalendar({ content }: LmEventCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventCalendar | null>()
  return (
    <>
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

      <Calendar
        localizer={localizer}
        culture={'de'}
        events={
          content.event_calendar_data?.length
            ? parseEventsToCalendar(content.event_calendar_data)
            : []
        }
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
        style={{ height: 500 }}
        messages={{
          next: 'nächste',
          previous: 'vorherige',
          today: 'Heute',
          month: 'Monat',
          day: 'Tag',
          week: 'Woche',
          agenda: 'Liste',
          time: 'Zeit',
          date: 'Datum',
          event: 'Event'
        }}
      />
    </>
  )
}
