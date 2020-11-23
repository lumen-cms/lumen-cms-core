import { ParallaxBanner } from 'react-scroll-parallax'
import clsx from 'clsx'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Image from 'next/image'
import { getRootImageUrl } from '../../utils/ImageService'
import { LmComponentRender } from '../..'
import { LmSectionParallaxProps } from './sectionTypes'

const useStyles = makeStyles({
  parallaxRoot: {
    position: 'relative'
  },
  parallaxContent: {
    overflowX: 'hidden',
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

export default function LmSectionParallax({
  content
}: LmSectionParallaxProps): JSX.Element {
  const classes = useStyles()
  const contentHeight = content.height
  const styles = {
    height: contentHeight ? `${contentHeight}vh` : '50vh'
  }

  return (
    <div className={classes.parallaxRoot} style={{ ...styles }}>
      <ParallaxBanner
        style={styles}
        layers={
          content.elements?.map((item) => {
            return {
              amount: Number(item.amount),
              children: (
                <>
                  {item.image && (
                    <Image
                      priority={!!content.disable_lazy_load}
                      src={getRootImageUrl(item.image)}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  {item.children?.map((child: any) => (
                    <LmComponentRender content={child} key={child._uid} />
                  ))}
                </>
              )
            }
          }) || []
        }
      />
      <div
        className={clsx(classes.parallaxContent, content.class_names?.values)}
        style={styles}
      >
        {content.body?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </div>
    </div>
  )
}
