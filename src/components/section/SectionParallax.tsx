import { ParallaxBanner } from 'react-scroll-parallax'
import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'
import { LmComponentRender } from '@LmComponentRender'
import { LmSectionParallaxProps } from './sectionTypes'
import { getRootImageUrl } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
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
  content,
  sectionPosition
}: LmSectionParallaxProps): JSX.Element {
  const { classes } = useStyles()
  const contentHeight = content.height
  const styles = {
    height: contentHeight ? `${contentHeight}vh` : '50vh'
  }

  const isPriority = sectionPosition === 0 || !!content.disable_lazy_load
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
                      priority={isPriority}
                      {...storyblokImageLoader(item.image)}
                      src={getRootImageUrl(item.image)}
                      layout="fill"
                      objectFit="cover"
                      {...(item.parallax_item_data?.base64 && {
                        placeholder: 'blur',
                        blurDataURL: item.parallax_item_data.base64
                      })}
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
