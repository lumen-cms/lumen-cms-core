import { makeStyles } from '@material-ui/core/styles'
import { useInView } from 'react-intersection-observer'
import ReactPlayer from 'react-player/lazy'
import clsx from 'clsx'
import Skeleton from '@material-ui/lab/Skeleton'
import React from 'react'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmPlayerProps } from './playerTypes'
import videoUrlHelper from '../../utils/videoUrlHelper'

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

export default function LmPlayer({ content }: LmPlayerProps): JSX.Element {
  const classes = useStyles()
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )

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
          url={videoUrlHelper(content)}
          volume={content.muted ? 0 : Number(content.volume || 0)}
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
