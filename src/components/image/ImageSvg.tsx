import { useInView } from 'react-intersection-observer'
import SVG from 'react-inlinesvg'
import { useState } from 'react'
import Fade from '@mui/material/Fade'
import { intersectionImageOptions } from '../../utils/intersectionObserverConfig'
import { LmImageProps } from './imageTypes'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const StyledSvg = styled(SVG)({
  display: 'inline-block',
  width: 120,
  height: 120,
  '&.has-color': {
    '& path': {
      fill: 'currentColor'
    }
  }
})

export default function ImageSvg({
  content,
  onClick
}: LmImageProps): React.JSX.Element {
  const [refIntersectionObserver, inView] = useInView(intersectionImageOptions)
  let src = inView ? content.source : ''
  const [loaded, setLoaded] = useState<boolean>(false)
  const afterSvgLoaded = () => {
    setLoaded(true)
  }
  const onErrorHandler = (error: any) => {
    console.error(error)
  }
  const fitInColor =
    (content.color && content.color.rgba) || content.fit_in_color // legacy fit_in_color

  if (src?.includes('a.storyblok.com')) {
    src = src?.replace('a.storyblok.com', 's3.amazonaws.com/a.storyblok.com')
  }
  return (
    <Fade in={loaded}>
      <Box sx={{ display: 'inline-block' }} ref={refIntersectionObserver}>
        {!!src && (
          <StyledSvg
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
            className={clsx({
              'has-color': !!fitInColor
            })}
          />
        )}
      </Box>
    </Fade>
  )
}
