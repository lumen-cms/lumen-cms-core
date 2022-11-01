import { ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax'
import Image from 'next/future/image'
import { LmComponentRender } from '@LmComponentRender'
import { LmSectionParallaxProps } from './sectionTypes'
import {
  getOriginalImageDimensions,
  getRootImageUrl
} from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import Box from '@mui/material/Box'
import { BannerLayer } from 'react-scroll-parallax/dist/components/ParallaxBanner/types'

export default function LmSectionParallax({
  content,
  sectionPosition
}: LmSectionParallaxProps) {
  const contentHeight = content.height
  const isPriority = sectionPosition === 0 || !!content.disable_lazy_load

  const Children =
    content.elements?.map(
      (
        {
          always_complete_animation,
          amount,
          speed,
          image,
          parallax_item_data,
          children,
          expanded,
          easing,
          ...props
        },
        index
      ) => {
        const layerProps: BannerLayer = {}
        Object.keys(props).forEach((key) => {
          const lProp = props[key].split(',').map((i: string) => {
            const trimmed = i.trim()
            return Number(trimmed) ? Number(trimmed) : trimmed
          })

          layerProps[key] = lProp
        })
        return (
          <ParallaxBannerLayer
            key={index}
            shouldAlwaysCompleteAnimation={always_complete_animation || false}
            speed={amount ? Number(amount) * 10 : speed ? Number(speed) : -20}
            expanded={expanded}
            easing={easing || undefined}
            {...layerProps}
          >
            <>
              {image && (
                <Image
                  {...getOriginalImageDimensions(image)}
                  priority={isPriority}
                  style={{
                    width: '100%',
                    height: 'auto'
                  }}
                  alt={'image of ' + image}
                  {...storyblokImageLoader(image)}
                  src={getRootImageUrl(image)}
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
          </ParallaxBannerLayer>
        )
      }
    ) ?? []
  if (content.body?.length) {
    Children.push(
      <Box
        key={Children.length + 1}
        sx={{
          overflowX: 'hidden',
          zIndex: 1,
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
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
    )
  }
  return Children.length ? (
    <Box
      position={'relative'}
      width={'100%'}
      sx={{
        alignSelf: 'flex-start',
        margin: '0 auto',
        maxWidth: '100vw',
        maxHeight: {
          xs: content.max_height_mobile || 250,
          sm: 'fit-content'
        },
        position: 'relative',
        aspectRatio: content.ratio
          ? content.ratio.split(',').map((i) => i.trim())
          : undefined,
        height: !content.ratio ? `${contentHeight || 50}vh` : undefined,
        overflow: content.allow_overflow ? 'visible' : undefined
      }}
    >
      <ParallaxBanner
        style={{
          height: '100%',
          overflow: content.allow_overflow ? 'visible' : 'hidden'
        }}
      >
        {Children}
      </ParallaxBanner>
    </Box>
  ) : null
}
