import { useInView } from 'react-intersection-observer'
import React, { CSSProperties, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Container, { ContainerProps } from '@mui/material/Container'
import { LmComponentRender } from '@LmComponentRender'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import FullscreenVideoBg from './FullscreenVideoBg'
import { LmSectionVideoProps } from './sectionTypes'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  videoSection: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    height: '100%',
    alignItems: 'end',
    justifyItems: 'center',
    '& > div:last-of-type': {
      zIndex: 0,
      height: '100%',
      width: '100%',
      position: 'absolute'
    },
    '& video[poster]': {
      objectFit: 'cover'
    },

    '& .videobg': {
      position: 'relative',
      width: '100%' /* Set video container element width here */,
      height: '100%' /* Set video container element height here */,
      overflow: 'hidden',
      background: '#111' /* bg color, if video is not high enough */
    },

    /* horizontally center the video */
    '& .videobg-width': {
      position: 'absolute',
      width: '100%' /* Change width value to cover more area */,
      height: '100%',
      left: '-9999px',
      right: '-9999px',
      margin: 'auto'
    },
    /* set video aspect ratio and vertically center */
    '& .videobg-aspect': {
      position: 'absolute',
      width: '100%',
      height: 0,
      top: '-9999px',
      bottom: '-9999px',
      margin: 'auto',
      // padding-bottom: 56.25%; /* 16:9 ratio this is calculated inside the component */
      overflow: 'hidden'
    },

    '& .videobg-make-height': {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
  // > .mdc-layout-grid {
  //     position: relative;
  //     z-index: 0;
  //   }
  // }
})

export default function LmSectionVideo({
  content
}: LmSectionVideoProps): JSX.Element {
  const { classes } = useStyles()
  const theme = useTheme()
  const [intersectionRef, inView, intersectionElement] = useInView(
    intersectionDefaultOptions
  )
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0
  })
  const videoUrl = content.url_internal?.filename || content.url

  const hasSrc = !!videoUrl
  const body = content.body || []
  const hasBody = !!body.length
  const fixedToRatio = !content.height // enable fixed ratio if height is not set (!hasBody)

  let ratioHeight = 9
  let ratioWidth = 16
  if (content.video_ratio) {
    const ratio = content.video_ratio.split('x')
    ratioWidth = parseInt(ratio[0])
    ratioHeight = parseInt(ratio[1])
  }

  const containerStyle: CSSProperties = {}
  if (content.height) {
    containerStyle.height = `${content.height}vh` // has errors.. on small devices
  } else {
    containerStyle.paddingBottom = `${(
      (ratioHeight / ratioWidth) *
      100
    ).toFixed(2)}%`
  }

  useEffect(() => {
    if (inView) {
      if (!fixedToRatio && intersectionElement) {
        const current = intersectionElement.target
        setContainerDimensions({
          width: current.clientWidth,
          height: current.clientHeight
        })
      }
    }
  }, [inView, videoUrl, fixedToRatio, intersectionElement])

  const maxWidth = content.max_width
    ? content.max_width === 'none'
      ? false
      : content.max_width
    : theme.defaultContainerWidth

  return (
    <div
      className={classes.videoSection}
      style={containerStyle}
      ref={intersectionRef}
      id={content.section_identifier || content._uid}
    >
      {hasSrc && (
        <FullscreenVideoBg
          {...content}
          inView={inView}
          containerDimensions={containerDimensions}
          fixedToRatio={fixedToRatio}
          ratioHeight={ratioHeight}
          ratioWidth={ratioWidth}
        />
      )}
      {hasBody && (
        <div>
          <Container
            style={{ height: '100%' }}
            maxWidth={maxWidth as ContainerProps['maxWidth']}
          >
            {body.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Container>
        </div>
      )}
    </div>
  )
}
