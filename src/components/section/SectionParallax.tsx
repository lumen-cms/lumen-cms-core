import { ParallaxBanner } from 'react-scroll-parallax'
import React, { CSSProperties } from 'react'
import Image from 'next/image'
import { LmComponentRender } from '@LmComponentRender'
import { LmSectionParallaxProps } from './sectionTypes'
import { getRootImageUrl } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import Box from '@mui/material/Box'

export default function LmSectionParallax({
  content,
  sectionPosition
}: LmSectionParallaxProps): JSX.Element {
  const contentHeight = content.height
  const styles: CSSProperties = {
    height: contentHeight ? `${contentHeight}vh` : '50vh'
  }

  const isPriority = sectionPosition === 0 || !!content.disable_lazy_load
  return (
    <Box
      sx={{
        position: 'relative',
        ...styles
      }}
    >
      <ParallaxBanner
        style={styles}
        layers={
          content.elements?.map((item) => {
            const {
              always_complete_animation,
              amount,
              speed,
              image,
              parallax_item_data,
              children
            } = item
            return {
              shouldAlwaysCompleteAnimation: always_complete_animation || false,
              speed: amount ? Number(amount) * 10 : speed || -20,
              children: (
                <>
                  {image && (
                    <Image
                      priority={isPriority}
                      {...storyblokImageLoader(image)}
                      src={getRootImageUrl(image)}
                      layout="fill"
                      objectFit="cover"
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
          }) || []
        }
      />
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
            height: '100%'
          }
        }}
        className={content.class_names?.values?.join(' ')}
      >
        {content.body?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </Box>
    </Box>
  )
}
