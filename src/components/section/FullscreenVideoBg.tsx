import { useStyles } from 'tss-react/mui'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'
import React, { useState } from 'react'
import BackgroundImageContainer from './BackgroundImage'
import videoUrlHelper from '../../utils/videoUrlHelper'
import { LmSectionVideoProps } from './sectionTypes'

type ContainerDimensions = {
  width: number
  height: number
}

type FullscreenVideoBgProps = LmSectionVideoProps['content'] & {
  containerDimensions: ContainerDimensions
  fixedToRatio: boolean
  ratioHeight: number
  ratioWidth: number
  inView: boolean
}

export default function FullscreenVideoBg(
  content: FullscreenVideoBgProps
): JSX.Element {
  const { inView, property, ratioHeight, ratioWidth } = content
  const { cx } = useStyles()
  const properties = property || []
  const videoAspect = ratioHeight / ratioWidth
  // let fixedToRatio = content.fixedToRatio
  const [error, setError] = useState<any>()
  const className = cx('react-player')
  const videoUrl = content.url_internal?.filename || content.url || ''

  if (!videoUrl) {
    return <div>please insert a video URL</div>
  }

  const muted = properties.includes('muted')
  const playerProps: ReactPlayerProps = {
    loop: properties.includes('loop'),
    playing: properties.includes('autoplay'),
    muted,
    controls: properties.includes('controls'),
    playsinline: properties.includes('playsinline'),
    light: properties.includes('light')
      ? content.fallback_image || true
      : false,
    onError: (error) => setError(error),
    volume: muted ? 0 : undefined
  }

  // calculate video container to fit into available space
  const windowWidth = content.containerDimensions.width
  const windowHeight = content.containerDimensions.height
  const windowAspect = windowHeight / windowWidth
  let vidBgWidth = '100%'
  if (windowAspect > videoAspect) {
    vidBgWidth = `${((windowAspect / videoAspect) * 100).toFixed(2)}%`
  }
  if (error) {
    console.error(error)
  }

  return (
    <>
      <div
        className={`videobg-width${
          properties.includes('suppress_mouse_events') ? ' video-no-mouse' : ''
        }`}
        style={{ width: vidBgWidth }}
      >
        <div
          className="videobg-aspect"
          style={{ paddingBottom: `${(videoAspect * 100).toFixed(2)}%` }}
        >
          <div className="videobg-make-height">
            <ReactPlayer
              {...videoUrlHelper(content, inView)}
              className={className}
              width="100%"
              height="100%"
              {...playerProps}
            />
          </div>
        </div>
      </div>
      {error && content.fallback_image && (
        <BackgroundImageContainer
          content={{
            image: content.fallback_image,
            background_data: content.section_video_bg_data,
            _uid: `bg_fallback_${content._uid}`,
            component: 'background'
          }}
        />
      )}
    </>
  )
}
