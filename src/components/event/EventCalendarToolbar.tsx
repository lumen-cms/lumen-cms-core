import React, { FC } from 'react'
import { Event, ToolbarProps } from 'react-big-calendar'
import Button from '@material-ui/core/Button'
import ViewComfy from '@material-ui/icons/ViewComfy'
import CalendarViewWeek from '@material-ui/icons/ViewWeek'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'
import ViewAgenda from '@material-ui/icons/ViewAgenda'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import TodayIcon from '@material-ui/icons/Today'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

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
