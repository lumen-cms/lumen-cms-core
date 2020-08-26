import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { LmComponentRender } from '../CoreComponents'
import { LmTimelineProps } from './timelineTypes'

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex'
  }
})

export function LmTimeline({ content }: LmTimelineProps): JSX.Element {
  const classes = useStyles()

  const body = content.body || []
  return (
    <div className="lm-timeline">
      <Grid container className={classes.container}>
        {body.map((blok, i) =>
          LmComponentRender({ content: blok, iteration: i, key: blok._uid, i })
        )}
      </Grid>
    </div>
  )
}
