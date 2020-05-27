import { useInView } from 'react-intersection-observer'
import SVG from 'react-inlinesvg'
import * as React from 'react'
import { useState } from 'react'
import { ImageStoryblok } from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Fade from '@material-ui/core/Fade'

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
type ImageSvgProps = { content: ImageStoryblok }

export default function ImageSvg({ content }: ImageSvgProps): JSX.Element {
  const classes = useStyles()
  const [refIntersectionObserver, inView] = useInView(intersectionDefaultOptions)
  const src = inView ? content.source : ''
  const [loaded, setLoaded] = useState<boolean>(false)
  const afterSvgLoaded = () => {
    setLoaded(true)
  }
  const onErrorHandler = (error: any) => {
    console.error(error)
  }
  const fitInColor = (content.color && content.color.rgba) || content.fit_in_color // legacy fit_in_color
  return (
    <Fade in={loaded}>
      <div className={classes.root}
           ref={refIntersectionObserver}>
        {!!src && <SVG src={src as string}
                       style={{
                         color: fitInColor,
                         width: content.width && `${content.width}px`,
                         height: content.height && `${content.height}px`
                       }}
                       onLoad={afterSvgLoaded}
                       onError={onErrorHandler}
                       className={clsx(classes.svg, {
                         'has-color': !!fitInColor
                       })} />}
      </div>
    </Fade>
  )
}

