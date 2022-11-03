import { useInView } from 'react-intersection-observer'
import ReactPlayer from 'react-player/lazy'
import React, { useState } from 'react'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmPlayerProps } from './playerTypes'
import videoUrlHelper from '../../utils/videoUrlHelper'
import LmAspectRatio from '../image/LmAspectRatio'

export default function LmPlayer({ content }: LmPlayerProps): JSX.Element {
  // const { classes, cx } = useStyles()
  const [playing, setPlaying] = useState<boolean>(!!content.playing)
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const togglePlay = () => {
    if (content.toggle_play_on_hover) {
      setPlaying((prev) => !prev)
    }
  }

  let ratios: string[] = []
  if (content.ratio) {
    const str = content.ratio.replaceAll('x', '/')
    ratios = str.split(',')
  }

  return (
    <>
      <LmAspectRatio
        ratio={ratios}
        ref={!content.disable_lazy_load ? refIntersectionObserver : null}
        sx={{
          position: 'relative',
          '& video[poster]': {
            objectFit: 'cover'
          },
          ...(content.border_radius && {
            '& iframe, & > div > div': {
              borderRadius: 'inherit'
            }
          }),
          ...(content.ratio && {
            '& video': {
              objectFit: 'cover'
            }
          })
        }}
      >
        {(content.disable_lazy_load || inView) && (
          <ReactPlayer
            // onMouseEnter={() => {
            //   togglePlay()
            // }}
            // onMouseLeave={() => {
            //   togglePlay()
            // }}
            style={{
              ...(content.ratio && {
                position: 'absolute',
                top: 0,
                left: 0
              }),
              borderRadius: content.border_radius
                ? content.border_radius
                : undefined
            }}
            {...videoUrlHelper(
              content,
              content.disable_lazy_load ? true : inView
            )}
            volume={content.muted ? 0 : Number(content.volume || 0)}
            loop={content.loop}
            muted={content.muted}
            playsinline={content.playsinline}
            playing={playing}
            light={content.light ? content.fallback_image || true : false}
            controls={content.controls}
            height={content.ratio ? '100%' : content.height || undefined}
            width={content.ratio ? '100%' : content.width || undefined}
          />
        )}
      </LmAspectRatio>
    </>
  )
}
