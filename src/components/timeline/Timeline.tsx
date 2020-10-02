import React from 'react'
import Timeline from '@material-ui/lab/Timeline'
import { LmTimelineProps } from './timelineTypes'
import { LmComponentRender } from '../..'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'

export default function LmTimeline({ content }: LmTimelineProps): JSX.Element {
  const { isMobile } = useDeviceDimensions()
  return (
    <Timeline align={isMobile ? 'left' : content.align || 'alternate'}>
      {content.body?.map((blok, i) => (
        <LmComponentRender
          content={blok}
          options={content}
          key={blok._uid}
          isLast={i + 1 === content.body?.length}
          isMobile={isMobile}
        />
      ))}
    </Timeline>
  )
}
