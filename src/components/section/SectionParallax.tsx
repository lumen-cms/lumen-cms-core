import { BannerLayer, ParallaxBanner } from 'react-scroll-parallax'
import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { useWindowSize } from '@react-hook/window-size'
import { getImageAttrs } from '../../utils/ImageService'
import { getImagePromise } from '../../utils/fetchImageHelper'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmComponentRender } from '../..'
import { LmSectionParallaxProps } from './sectionTypes'

const useStyles = makeStyles({
  parallax: {
    '& .parallax__content': {
      zIndex: 1,
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }
})

export default function LmSectionParallax({
  content
}: LmSectionParallaxProps): JSX.Element {
  const classes = useStyles()
  const [refIntersectionObserver, inView, refElement] = useInView(
    intersectionDefaultOptions
  )
  const [width, height] = useWindowSize()
  const elements = useMemo(() => content.elements || [], [content.elements])
  const contentHeight = content.height
  const [layers, setLayers] = useState<BannerLayer[] | undefined>()
  const disableLazyLoad = content.disable_lazy_load
  const styles = {
    height: contentHeight ? `${contentHeight}vh` : '50vh'
  }
  useEffect(() => {
    const processLayers = () => {
      const items = elements.map(async (item) => {
        const containerHeight = height * Number((contentHeight as number) / 100)
        const offset = containerHeight * item.amount * 2
        const imgHeight = containerHeight + offset

        const img = getImageAttrs({
          originalSource: item.image,
          width,
          // eslint-disable-next-line no-bitwise
          height: ~~imgHeight,
          smart: true,
          focalPoint: item.image_focal_point
        })
        const imgSource = await getImagePromise({
          src: img.src,
          srcSet: img.srcSet
        })
        return {
          image: `"${imgSource}"`,
          amount: Number(item.amount),
          children: item.children?.length && (
            <LmComponentRender
              content={item.children[0]}
              key={item.children[0]._uid}
            />
          )
        }
      })
      Promise.all(items).then((lyrs) => {
        setLayers(lyrs as any)
      })
    }

    if (disableLazyLoad) {
      processLayers()
    } else if (inView) {
      refElement && processLayers()
    }
  }, [
    inView,
    width,
    height,
    elements,
    contentHeight,
    disableLazyLoad,
    refElement
  ])

  const body = content.body || []

  return (
    <div
      className={classes.parallax}
      style={{ ...styles, position: 'relative' }}
      ref={refIntersectionObserver}
    >
      <ParallaxBanner disabled={false} style={styles} layers={layers || []}>
        {!layers && (
          <Skeleton
            style={{ position: 'absolute' }}
            width="100%"
            height="100%"
            variant="rect"
          />
        )}
      </ParallaxBanner>
      <div
        className={clsx('parallax__content', content.class_names?.values)}
        style={styles}
      >
        {body.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </div>
    </div>
  )
}
