import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineItem from '@material-ui/lab/TimelineItem'
import React from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { LmComponentRender } from '@LmComponentRender'
import { CardContentContainer } from './CardContentContainer'
import { LmTimelineItemProps } from './timelineTypes'

const useStyles = makeStyles((theme) =>
  createStyles({
    naked: {
      padding: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 'unset'
    },
    hideMargin: {
      marginTop: 0,
      marginBottom: 0
    },
    hideOnMobile: {
      [theme.breakpoints.only('xs')]: {
        display: 'none'
      }
    },
    showOnMobile: {
      display: 'none',
      [theme.breakpoints.only('xs')]: {
        display: 'block'
      }
    },
    ghostConnector: {
      position: 'relative',
      '& .ghost': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
      }
    }
  })
)

export default function LmTimelineItem({
  content,
  options,
  isLast
}: LmTimelineItemProps) {
  const classes = useStyles()
  const hasOppositeContent = content.opposite_body?.length
  return (
    <TimelineItem>
      <TimelineOppositeContent
        classes={{
          root: classes.hideOnMobile
        }}
      >
        {content.opposite_body?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </TimelineOppositeContent>
      <TimelineSeparator>
        {content.icon?.length ? (
          content.icon.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))
        ) : (
          <TimelineDot
            color={content.dot_color || undefined}
            variant={
              content.dot_variant === 'outlined' ||
              options?.variant === 'outlined'
                ? 'outlined'
                : 'default'
            }
            className={clsx({
              [classes.naked]:
                content.dot_variant === 'naked' || options?.variant === 'naked',
              [classes.hideMargin]: options.connect_separator
            })}
          ></TimelineDot>
        )}
        <TimelineConnector
          className={
            classes.ghostConnector +
            (isLast && !options.show_last_line && ' d-none')
          }
        >
          <span className={'ghost'}></span>
        </TimelineConnector>
      </TimelineSeparator>
      <TimelineContent>
        {hasOppositeContent && (
          <div className={'pb-2 ' + classes.showOnMobile}>
            {content.opposite_body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </div>
        )}

        <CardContentContainer content={content} options={options}>
          {(content.title || content.subheader) && (
            <CardHeader title={content.title} subheader={content.subheader} />
          )}
          {(content.body || []).length > 0 && (
            <CardContent
              style={{ padding: options.disable_card ? 0 : undefined }}
            >
              {content.body?.map((blok) => (
                <LmComponentRender content={blok} key={blok._uid} />
              ))}
            </CardContent>
          )}
        </CardContentContainer>
      </TimelineContent>
    </TimelineItem>
  )
}
