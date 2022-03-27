import { ParallaxBanner } from 'react-scroll-parallax'
import React, { CSSProperties } from 'react'
import Image from 'next/image'
import { LmComponentRender } from '@LmComponentRender'
import { LmSectionParallaxProps } from './sectionTypes'
import { getRootImageUrl } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import Box from '@mui/material/Box'
import { BannerLayer } from 'react-scroll-parallax/dist/components/ParallaxBanner/types'

export default function LmSectionParallax({
  content,
  sectionPosition
}: LmSectionParallaxProps): JSX.Element {
  const contentHeight = content.height
  const styles: CSSProperties = content.ratio
    ? {
        aspectRatio: content.ratio
      }
    : {
        height: contentHeight ? `${contentHeight}vh` : '50vh'
      }

  const isPriority = sectionPosition === 0 || !!content.disable_lazy_load

  return (
    <Box
      maxHeight={[content.max_height_mobile || 250, null]}
      width={'100%'}
      style={styles}
    >
      <ParallaxBanner
        style={styles}
        layers={
          content.elements?.map(
            ({
              always_complete_animation,
              amount,
              speed,
              image,
              parallax_item_data,
              children,
              expanded,
              easing,
              ...props
            }) => {
              const layerProps: BannerLayer = {}
              Object.keys(props).forEach((key) => {
                const lProp = props[key].split(',').map((i: string) => {
                  const trimmed = i.trim()
                  return Number(trimmed) ? Number(trimmed) : trimmed
                })

                layerProps[key] = lProp
              })
              return {
                shouldAlwaysCompleteAnimation:
                  always_complete_animation || false,
                speed: amount
                  ? Number(amount) * 10
                  : speed
                  ? Number(speed)
                  : -20,
                expanded,
                easing: easing || undefined,
                ...layerProps,
                children: (
                  <>
                    {image && (
                      <Image
                        priority={isPriority}
                        {...storyblokImageLoader(image)}
                        src={getRootImageUrl(image)}
                        layout="fill"
                        objectFit="cover"
                        sizes={
                          content.height && content.ratio
                            ? `${content.height}px`
                            : undefined
                        }
                        {...(parallax_item_data?.base64 && {
                          placeholder: 'blur',
                          blurDataURL: parallax_item_data.base64
                        })}
                      />
                    )}
                    {children?.map((child) => (
                      <LmComponentRender content={child} key={child._uid} />
                    ))}
                  </>
                )
              }
            }
          ) || []
        }
      >
        {!!content.body?.length && (
          <Box
            sx={{
              overflowX: 'hidden',
              zIndex: 1,
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              ...styles,
              '& > .lm-grid-row__wrap': {
                overflowX: 'hidden',
                height: '100%'
              }
            }}
            className={content.class_names?.values?.join(' ')}
          >
            {content.body.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Box>
        )}
      </ParallaxBanner>
    </Box>
  )
}
