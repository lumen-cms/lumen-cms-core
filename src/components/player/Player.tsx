import { makeStyles } from '@material-ui/core/styles'
import { useInView } from 'react-intersection-observer'
import ReactPlayer from 'react-player'
import clsx from 'clsx'
import Skeleton from '@material-ui/lab/Skeleton'
import React from 'react'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmPlayerProps } from './playerTypes'

const useStyles = makeStyles({
  videoContainer: {
    position: 'relative'
  },
  ratio16x9: {
    paddingTop: `${100 / (16 / 9)}%`
  },
  ratio4x3: {
    paddingTop: `${100 / (4 / 3)}%`
  },
  ratio3x2: {
    paddingTop: `${100 / (3 / 2)}%`
  },
  ratio1x1: {
    paddingTop: `100%`
  }
})

export function LmPlayer({ content }: LmPlayerProps): JSX.Element {
  const classes = useStyles()
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )

  // need to define style rather than class name otherwise change in Storybook not detected if ratio changes

  const url =
    content.url && content.url.indexOf(',') !== -1
      ? content.url.split(',').map((i) => i.trim())
      : content.url
  return (
    <div
      ref={refIntersectionObserver}
      className={clsx(classes.videoContainer, {
        [classes[`ratio${content.ratio}`]]: !!content.ratio
      })}
    >
      {inView ? (
        <ReactPlayer
          style={{
            position: content.ratio ? 'absolute' : undefined,
            top: content.ratio ? 0 : undefined,
            left: content.ratio ? 0 : undefined
          }}
          url={url}
          volume={content.muted ? 0 : content.volume}
          loop={content.loop}
          muted={content.muted}
          playsinline={content.playsinline}
          playing={content.playing}
          light={content.fallback_image || content.light}
          controls={content.controls}
          height={content.ratio ? '100%' : content.height || undefined}
          width={content.ratio ? '100%' : content.width || undefined}
        />
      ) : (
        <Skeleton
          style={{ position: 'absolute' }}
          width="100%"
          height="100%"
          variant="rect"
        />
      )}
    </div>
  )
}
