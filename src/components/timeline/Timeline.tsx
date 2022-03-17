import React from 'react'
import Timeline from '@mui/lab/Timeline'
import { LmComponentRender } from '@LmComponentRender'
import { LmTimelineProps } from './timelineTypes'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'

export default function LmTimeline({ content }: LmTimelineProps): JSX.Element {
  const { isMobile } = useDeviceDimensions()
  // const x = useTween({})
  return (
    <Timeline align={isMobile ? 'left' : content.align || 'alternate'}>
      {content.body?.map((blok, i) => (
        <LmComponentRender
          content={blok}
          options={content}
          key={blok._uid}
          isLast={i + 1 === content.body?.length}
        />
      ))}
    </Timeline>
  )
}
