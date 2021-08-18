import { EventCalendar, LmEventCalendarProps } from './eventTypes'
import {
  Calendar,
  CalendarProps,
  dateFnsLocalizer,
  Event,
  ToolbarProps,
  Views
} from 'react-big-calendar'
import TodayIcon from '@material-ui/icons/Today'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { de } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseEventsToCalendar } from './eventCalendarHelper'
import React, { FC, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import LmEvent from './Event'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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

const messages: CalendarProps['messages'] = {
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
}

const CalendarToolbar: FC<ToolbarProps<Event>> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        padding: '8px 0'
      }}
    >
      <Typography>{props.label}</Typography>
      <div style={{ flex: 1 }}></div>
      <IconButton
        onClick={() => {
          props.onNavigate('TODAY')
        }}
      >
        <TodayIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          props.onNavigate('PREV')
        }}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          props.onNavigate('NEXT')
        }}
      >
        <NavigateNextIcon />
      </IconButton>
      {props.views.length > 1 && (
        <TextField
          SelectProps={{ native: true, displayEmpty: true }}
          select
          onChange={(val) => {
            props.onView(val.target.value)
          }}
        >
          {props.views.map((v) => (
            <option value={v} key={v}>
              {messages[v]}
            </option>
          ))}
        </TextField>
      )}
    </div>
  )
}

export default function LmEventCalendar({ content }: LmEventCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventCalendar | null>()
  const views = content.views?.length
    ? content.views
    : [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]
  const currentView = views.includes(content.view || Views.MONTH)
    ? content.view || Views.MONTH
    : views[0]

  return (
    <>
      <Calendar
        localizer={localizer}
        culture={'de'}
        views={views}
        defaultView={currentView}
        components={{
          toolbar: CalendarToolbar
        }}
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
        style={{ height: 500, width: '100%' }}
        messages={messages}
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
