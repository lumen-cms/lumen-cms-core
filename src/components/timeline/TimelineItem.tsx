import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineItem from '@mui/lab/TimelineItem'
import React, { useRef } from 'react'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { LmComponentRender } from '@LmComponentRender'
import { CardContentContainer } from './CardContentContainer'
import { LmTimelineItemProps } from './timelineTypes'
import { makeStyles } from 'tss-react/mui'
import { useEffectOnce } from 'react-use'

const useStyles = makeStyles({ name: 'TimelineItem' })((theme) => ({
  naked: {
    padding: 0,
    boxShadow: 'none',
    background: 'none!important',
    backgroundColor: 'transparent!important',
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
  }
}))

export default function LmTimelineItem({
  content,
  options,
  isLast,
  onFinish,
  setObserver
}: LmTimelineItemProps) {
  const { classes, cx } = useStyles()
  const timeline1 = useRef(null)
  const timeline2 = useRef(null)
  const dot1 = useRef(null)
  const hasOppositeContent = !!content.opposite_body?.length

  useEffectOnce(() => {
    if (setObserver) {
      setObserver(timeline1.current as any)
      setObserver(dot1.current as any)
      if (isLast) {
        setObserver(timeline2.current as any, () => {
          if (typeof onFinish === 'function') {
            onFinish()
          }
        })
      } else {
        setObserver(timeline2.current as any)
      }
    }
  })

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
        <TimelineConnector ref={timeline1} id={`timeline1_${content._uid}`} />
        <TimelineDot
          id={`dot1_${content._uid}`}
          ref={dot1}
          color={content.dot_color || undefined}
          variant={
            content.dot_variant === 'outlined' ||
            options?.variant === 'outlined'
              ? 'outlined'
              : 'filled'
          }
          className={cx({
            [classes.naked]: content.dot_variant
              ? content.dot_variant === 'naked'
              : options?.variant === 'naked',
            [classes.hideMargin]: options.connect_separator
          })}
        >
          {content.icon?.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </TimelineDot>

        <TimelineConnector
          id={`timeline2_${content._uid}`}
          ref={timeline2}
          className={isLast && !options.show_last_line ? ' d-none' : ''}
        />
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
