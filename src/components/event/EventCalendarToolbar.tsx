import React, { FC } from 'react'
import { Event, ToolbarProps } from 'react-big-calendar'
import Button from '@mui/material/Button'
import ViewComfy from '@mui/icons-material/ViewComfy'
import CalendarViewWeek from '@mui/icons-material/ViewWeek'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay'
import ViewAgenda from '@mui/icons-material/ViewAgenda'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TodayIcon from '@mui/icons-material/Today'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

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

export const CalendarToolbar: FC<ToolbarProps<Event>> = (props) => {
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
        size="large"
      >
        <TodayIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          props.onNavigate('PREV')
        }}
        size="large"
      >
        <NavigateBeforeIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          props.onNavigate('NEXT')
        }}
        size="large"
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
