import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineItem from '@material-ui/lab/TimelineItem'
import React from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { CardContentContainer } from './CardContentContainer'
import { LmComponentRender } from '../CoreComponents'
import { LmTimelineItemProps } from './timelineTypes'

const useStyles = makeStyles({
  naked: {
    padding: 0,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 'unset'
  },
  none: {
    display: 'none'
  }
})

export function LmTimelineItem({
  content,
  options,
  isMobile,
  isLast
}: LmTimelineItemProps) {
  const classes = useStyles()
  return (
    <TimelineItem>
      <TimelineOppositeContent
        classes={{
          root: isMobile ? classes.none : undefined
        }}
      >
        {content.opposite_body?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          color={content.dot_color || undefined}
          variant={
            content.dot_variant === 'outlined' || options?.variant === 'outlined'
              ? 'outlined'
              : 'default'
          }
          className={clsx({
            [classes.naked]:
              content.dot_variant === 'naked' || options?.variant === 'naked'
          })}
        >
          {content.icon &&
            content.icon.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Card>
          <CardContentContainer content={content}>
            {(content.title || content.subheader) && (
              <CardHeader title={content.title} subheader={content.subheader} />
            )}
            {(content.body || []).length > 0 && (
              <CardContent>
                {content.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </CardContent>
            )}
          </CardContentContainer>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
