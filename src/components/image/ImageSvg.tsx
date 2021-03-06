import { useInView } from 'react-intersection-observer'
import SVG from 'react-inlinesvg'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Fade from '@material-ui/core/Fade'
import { intersectionImageOptions } from '../../utils/intersectionObserverConfig'
import { LmImageProps } from './imageTypes'

const useStyles = makeStyles({
  root: {
    display: 'inline-block'
  },
  svg: {
    display: 'inline-block',
    width: 120,
    height: 120,
    '&.has-color': {
      '& path': {
        fill: 'currentColor'
      }
    }
  }
})

export default function ImageSvg({
  content,
  onClick
}: LmImageProps): JSX.Element {
  const classes = useStyles()
  const [refIntersectionObserver, inView] = useInView(intersectionImageOptions)
  const src = inView ? content.source : ''
  const [loaded, setLoaded] = useState<boolean>(false)
  const afterSvgLoaded = () => {
    setLoaded(true)
  }
  const onErrorHandler = (error: any) => {
    console.error(error)
  }
  const fitInColor =
    (content.color && content.color.rgba) || content.fit_in_color // legacy fit_in_color
  return (
    <Fade in={loaded}>
      <div className={classes.root} ref={refIntersectionObserver}>
        {!!src && (
          <SVG
            width={content.width}
            height={content.height}
            src={src as string}
            style={{
              cursor: onClick ? 'pointer' : undefined,
              color: fitInColor,
              width: content.width && `${content.width}px`,
              height: content.height && `${content.height}px`
            }}
            onClick={() => {
              onClick && onClick()
            }}
            onLoad={afterSvgLoaded}
            onError={onErrorHandler}
            className={clsx(classes.svg, {
              'has-color': !!fitInColor
            })}
          />
        )}
      </div>
    </Fade>
  )
}
