import { LmComponentRender } from '@LmComponentRender'
import { LmTimelineProps } from './timelineTypes'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import TimelineObserver from 'react-timeline-animation'
import { Box } from '@mui/material'
import { balloon, confetti, emoji, useReward } from 'react-rewards'
import Timeline from '@mui/lab/Timeline'
import { useRef } from 'react'
import { ConfettiStoryblok } from '../../typings/generated/components-schema'

const rewardEffects = { balloons: balloon, confetti, emoji }

function rewardConfig(rewardObject?: ConfettiStoryblok) {
  const config: { count?: number; colors?: string[]; emojis?: string[] } = {}
  if (rewardObject?.elementCount) {
    config.count = Number(rewardObject.elementCount)
  }
  if (rewardObject?.colors) {
    config.colors = rewardObject.colors.split(',').map((i) => i.trim())
  }
  if (rewardObject?.emojis) {
    config.emojis = rewardObject.emojis.split(',')
  }
  return config
}

export default function LmTimeline({ content }: LmTimelineProps) {
  const { isMobile } = useDeviceDimensions()
  const rewardObject = content.confetti?.[0]
  const rewardRef = useRef<HTMLSpanElement>(null)
  const { reward } = useReward(
    rewardRef,
    rewardEffects[rewardObject?.type || 'confetti'],
    rewardConfig(rewardObject),
    { zIndex: 99999 }
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
            // @ts-ignore
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
            sx={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <span id={'confetti-' + content._uid} ref={rewardRef} />
          </Box>
        )}
      </>
    )
  }
  return (
    // @ts-ignore
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
