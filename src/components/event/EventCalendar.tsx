import { EventCalendar, LmEventCalendarProps } from './eventTypes'
import {
  Calendar,
  CalendarProps,
  dateFnsLocalizer,
  Event,
  ToolbarProps,
  Views
} from 'react-big-calendar'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import TodayIcon from '@material-ui/icons/Today'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import CalendarViewWeek from '@material-ui/icons/ViewWeek'
import ViewAgenda from '@material-ui/icons/ViewAgenda'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseEventsToCalendar } from './eventCalendarHelper'
import React, { FC, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import LmEvent from './Event'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import ViewComfy from '@material-ui/icons/ViewComfy'

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

const SelectCalendarView: FC<{
  onView: ToolbarProps['onView']
  views: ToolbarProps['views']
  view: ToolbarProps['view']
}> = ({ onView, views, view }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        {
          {
            month: <ViewComfy />,
            week: <CalendarViewWeek />,
            day: <CalendarViewDayIcon />,
            agenda: <ViewAgenda />
          }[view as string]
        }
        <ArrowDropDown />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {(Array.isArray(views) ? views : []).map((currentView) => (
          <MenuItem
            onClick={() => {
              onView(currentView)
              handleClose()
            }}
            key={currentView}
          >
            {
              {
                month: <ViewComfy />,
                week: <CalendarViewWeek />,
                day: <CalendarViewDayIcon />,
                agenda: <ViewAgenda />
              }[currentView as string]
            }
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const CalendarToolbar: FC<ToolbarProps<Event>> = (props) => {
  let currentViews = Array.isArray(props.views) ? props.views : []
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
      {currentViews.length > 1 && (
        <SelectCalendarView
          onView={props.onView}
          views={props.views}
          view={props.view}
        />
      )}
    </div>
  )
}

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
