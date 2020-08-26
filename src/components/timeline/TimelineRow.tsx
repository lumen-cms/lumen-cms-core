import React from 'react'
import Grid from '@material-ui/core/Grid'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { TimelineRowItem } from './TimelineRowItem'
import { LmComponentRender } from '../CoreComponents'
import { LmTimelineItemProps } from './timelineTypes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconGrid: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    line: {
      position: 'absolute',
      left: 'calc(50% - 1px)',
      width: '2px',
      height: '100%',
      backgroundColor: theme.palette.grey.A100
    },
    iconContainer: {
      zIndex: 0,
      margin: '0 !important'
    }
  })
)

export function LmTimelineItem({
  content,
  iteration
}: LmTimelineItemProps): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <>
      <Grid item xs={8} sm={5}>
        {(iteration % 2 === 0 || isMobile) && (
          <TimelineRowItem isLeft content={content} />
        )}
      </Grid>
      <Grid item xs={4} sm={2} className={classes.iconGrid}>
        <div className={classes.line} />
        <div className={classes.iconContainer}>
          {content.icon &&
            content.icon.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
        </div>
      </Grid>
      <Grid
        item
        xs={5}
        sm={5}
        style={{ display: isMobile ? 'none' : undefined }}
      >
        {iteration % 2 !== 0 && (
          <TimelineRowItem isLeft={false} content={content} />
        )}
      </Grid>
    </>
  )
}
