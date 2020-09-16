import React from 'react'
import { IntersectionOptions, useInView } from 'react-intersection-observer'
import Slide, { SlideProps } from '@material-ui/core/Slide'
import Fade, { FadeProps } from '@material-ui/core/Fade'
import Grow, { GrowProps } from '@material-ui/core/Grow'
import Zoom, { ZoomProps } from '@material-ui/core/Zoom'
import Collapse, { CollapseProps } from '@material-ui/core/Collapse'
import { LmComponentRender } from '../CoreComponents'
import { LmMotionProps } from './motionTypes'

export function LmMotion({ content }: LmMotionProps): JSX.Element {
  const type = content.type || 'fade'
  const options: IntersectionOptions = {
    triggerOnce: true
  }
  if (content.threshold) {
    options.threshold = Number((Number(content.threshold) / 100).toFixed(2))
  }
  const [viewRef, inView] = useInView(options)

  const transitionProps: FadeProps | SlideProps | ZoomProps | GrowProps = {}
  if (content.duration) {
    transitionProps.timeout = Number(content.duration)
  }
  return (
    <div ref={viewRef} style={{
      overflow: content.enable_overflow ? undefined : 'hidden'
    }}>
      {
        {
          slide: (
            <Slide
              in={inView}
              {...(transitionProps as SlideProps)}
              direction={content.slide_direction || 'down'}
            >
              <div>
                {(content.body || []).map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Slide>
          ),
          fade: (
            <Fade in={inView} {...(transitionProps as FadeProps)}>
              <div>
                {(content.body || []).map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Fade>
          ),
          grow: (
            <Grow in={inView} {...(transitionProps as GrowProps)}>
              <div>
                {(content.body || []).map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Grow>
          ),
          zoom: (
            <Zoom in={inView} {...(transitionProps as ZoomProps)}>
              <div>
                {(content.body || []).map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Zoom>
          ),
          collapse: (
            <Collapse in={inView} {...(transitionProps as CollapseProps)}>
              <div>
                {(content.body || []).map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </div>
            </Collapse>
          )
        }[type]
      }
    </div>
  )
}
