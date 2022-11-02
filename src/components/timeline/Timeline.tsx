import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmTimelineProps } from './timelineTypes'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import Timeline from '@mui/lab/Timeline'
import TimelineObserver from 'react-timeline-animation'
import { Box } from '@mui/material'
import { useReward } from 'react-rewards'

export default function LmTimeline({ content }: LmTimelineProps) {
  const { isMobile } = useDeviceDimensions()
  const rewardObject = content.confetti?.[0]
  const { reward } = useReward(
    'confetti-' + content._uid,
    rewardObject?.type || 'confetti',
    {
      position: 'absolute',
      zIndex: 99999,
      elementCount: rewardObject?.elementCount
        ? Number(rewardObject.elementCount)
        : undefined,
      colors: rewardObject?.colors
        ? rewardObject.colors.split(',').map((i) => i.trim())
        : undefined,
      emoji: rewardObject?.emojis ? rewardObject.emojis.split(',') : undefined
    }
  )

  const initialColor = content.connector_color?.rgba
  const fillColor = content.connector_color_scroll?.rgba
  if (initialColor && fillColor) {
    return (
      <>
        <TimelineObserver
          initialColor={initialColor}
          fillColor={fillColor}
          handleObserve={(setObserver) => (
            <Timeline
              position={isMobile ? 'left' : content.align || 'alternate'}
            >
              {content.body?.map((blok, i) => (
                <LmComponentRender
                  content={blok}
                  options={content}
                  key={blok._uid}
                  isLast={i + 1 === content.body?.length}
                  setObserver={setObserver}
                  onFinish={() => {
                    if (rewardObject) {
                      reward()
                    }
                  }}
                />
              ))}
            </Timeline>
          )}
        />
        {rewardObject && (
          <Box
            textAlign={'center'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <span id={'confetti-' + content._uid} />
          </Box>
        )}
      </>
    )
  }
  return (
    <Timeline position={isMobile ? 'left' : content.align || 'alternate'}>
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
