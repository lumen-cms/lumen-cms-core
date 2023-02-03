import React, { useEffect, useRef, useState } from 'react'
import { IntersectionOptions, useInView } from 'react-intersection-observer'
import Slide, { SlideProps } from '@mui/material/Slide'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grow, { GrowProps } from '@mui/material/Grow'
import Zoom, { ZoomProps } from '@mui/material/Zoom'
import Collapse, { CollapseProps } from '@mui/material/Collapse'
import { LmComponentRender } from '@LmComponentRender'
import { LmMotionProps } from './motionTypes'
import Box from '@mui/material/Box'

export default function LmMotion({ content }: LmMotionProps): JSX.Element {
  const timeoutRef = useRef<number>()
  const type = content.type || 'fade'
  const options: IntersectionOptions = {
    triggerOnce: true
  }
  if (
    content.threshold &&
    Number(content.threshold) > 0 &&
    Number(content.threshold) <= 100
  ) {
    options.threshold = Number((Number(content.threshold) / 100).toFixed(2))
  }
  const [viewRef, inView] = useInView(options)
  const [start, setStart] = useState<boolean>()
  const delay = content.delay ? Number(content.delay) : 0

  useEffect(() => {
    if (inView) {
      if (delay) {
        timeoutRef.current = window.setTimeout(() => {
          setStart(true)
        }, delay)
      } else {
        setStart(true)
      }
    } else {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [inView, delay])

  const transitionProps: { timeout?: number } = {}
  if (content.duration) {
    transitionProps.timeout = Number(content.duration)
  }
  // const start = inView
  return (
    <Box
      className={'lm-motion__root'}
      ref={viewRef}
      sx={{
        overflow: content.enable_overflow ? undefined : 'hidden',
        width: content.body?.find((el) => el.component === 'image')
          ? '100%'
          : undefined,
        '& .lm-image img': {
          width: '100%!important',
          height: 'auto!important'
        }
      }}
    >
      {
        {
          slide: (
            <Slide
              in={start}
              {...(transitionProps as SlideProps)}
              direction={content.slide_direction || 'down'}
            >
              <div>
                {content.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Slide>
          ),
          fade: (
            <Fade in={start} {...(transitionProps as FadeProps)}>
              <div>
                {content.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Fade>
          ),
          grow: (
            <Grow in={start} {...(transitionProps as GrowProps)}>
              <div>
                {content.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Grow>
          ),
          zoom: (
            <Zoom in={start} {...(transitionProps as ZoomProps)}>
              <div>
                {content.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Zoom>
          ),
          collapse: (
            <Collapse in={start} {...(transitionProps as CollapseProps)}>
              <div>
                {content.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Collapse>
          )
        }[type]
      }
    </Box>
  )
}
