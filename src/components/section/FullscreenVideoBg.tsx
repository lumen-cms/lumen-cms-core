import clsx from 'clsx'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import React, { useState } from 'react'
import BackgroundImageContainer from './BackgroundImage'
import { SectionVideoBgStoryblok } from '../../typings/generated/components-schema'

type ContainerDimensions = {
  width: number
  height: number
}

type FullscreenVideoBgProps = SectionVideoBgStoryblok & {
  containerDimensions: ContainerDimensions
  fixedToRatio: boolean
  ratioHeight: number
  ratioWidth: number
}

function FullscreenVideoBg(content: FullscreenVideoBgProps): JSX.Element {
  const properties = content.property || []
  const videoAspect = content.ratioHeight / content.ratioWidth
  // let fixedToRatio = content.fixedToRatio
  const [error, setError] = useState(false)
  const className = clsx('react-player')
  if (!content.url) {
    return <div>please insert a video URL</div>
  }

  const muted = properties.includes('muted')
  const playerProps: ReactPlayerProps = {
    loop: properties.includes('loop'),
    playing: properties.includes('autoplay'),
    muted,
    controls: properties.includes('controls'),
    playsinline: properties.includes('playsinline'),
    light: content.fallback_image || properties.includes('light'),
    onError: () => setError(true),
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

  // cover the available space
  const url =
    content.url && content.url.indexOf(',') !== -1
      ? content.url.split(',').map((i) => i.trim())
      : content.url

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
              url={url}
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
            _uid: `bg_fallback_${content._uid}`,
            component: 'background'
          }}
        />
      )}
    </>
  )
}

export default FullscreenVideoBg
