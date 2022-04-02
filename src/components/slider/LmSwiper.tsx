import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'
import { LmSwiperProps } from './sliderTypes'
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { PaginationOptions } from 'swiper/types'
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'

const EffectCoverflow = dynamic(() => import('./SwiperEffectCoverflow'))
const EffectCube = dynamic(() => import('./SwiperEffectCube'))
const EffectFade = dynamic(() => import('./SwiperEffectFade'))
const EffectFlip = dynamic(() => import('./SwiperEffectFlip'))
const EffectCards = dynamic(() => import('./SwiperEffectCards'))
const EffectCreative = dynamic(() => import('./SwiperEffectCreative'))
export default function LmSwiper({ content }: LmSwiperProps) {
  const { property } = content
  const effect = content.effect
  const showPagination = !property?.includes('hide_pagination')

  const swiperProps: SwiperProps = {
    modules: [Scrollbar, A11y, Autoplay, Navigation, Pagination],
    freeMode: property?.includes('free_mode'),
    grabCursor: property?.includes('grab_cursor'),
    navigation: !property?.includes('hide_arrows'),
    ...(showPagination && {
      pagination: {
        clickable: true,
        dynamicMainBullets: content.max_pagination_bullets
          ? Number(content.max_pagination_bullets)
          : undefined,
        dynamicBullets: !!content.max_pagination_bullets
      } as PaginationOptions
    })
  }
  if (content.autoslide_duration) {
    swiperProps.autoplay = {
      delay: Number(content.autoslide_duration),
      pauseOnMouseEnter: content.pause_on_hover
    }
  }
  if (!content.effect || content.effect === 'fade') {
    const [mobileSlides, tabletSlides, desktopSlides] = content.slides_per_view
      ? content.slides_per_view.split(',').map((i) => Number(i.trim()))
      : [1]
    const [mobileSpace, tabletSpace, desktopSpace] =
      content.space_between_slides
        ? content.space_between_slides.split(',').map((i) => Number(i.trim()))
        : [0]
    swiperProps.slidesPerView = mobileSlides
    swiperProps.spaceBetween = mobileSpace
    swiperProps.breakpoints = {
      600: {
        slidesPerView: tabletSlides || mobileSlides,
        spaceBetween: tabletSpace || mobileSpace
      },
      900: {
        slidesPerView: desktopSlides || tabletSlides || mobileSlides,
        spaceBetween: desktopSpace || tabletSpace || mobileSpace
      }
    }
  }
  const Container: FC = ({ children }) => {
    if (effect === 'coverflow') {
      return (
        <EffectCoverflow swiperProps={swiperProps}>{children}</EffectCoverflow>
      )
    } else if (effect === 'cube') {
      return <EffectCube swiperProps={swiperProps}>{children}</EffectCube>
    } else if (effect === 'fade') {
      return <EffectFade swiperProps={swiperProps}>{children}</EffectFade>
    } else if (effect === 'flip') {
      return <EffectFlip swiperProps={swiperProps}>{children}</EffectFlip>
    } else if (effect === 'cards') {
      return <EffectCards swiperProps={swiperProps}>{children}</EffectCards>
    } else if (effect === 'creative') {
      return (
        <EffectCreative swiperProps={swiperProps}>{children}</EffectCreative>
      )
    }
    return <Swiper {...swiperProps}>{children}</Swiper>
  }
  const themeColors = content.theme_color?.split('.')
  return (
    <Box
      sx={{
        '--swiper-theme-color': (theme: Theme) =>
          themeColors?.[0]
            ? theme.palette[themeColors[0]][themeColors[1]]
            : theme.palette.text.primary,
        '--swiper-navigation-size': `${content.navigation_size || 44}px`,
        '--swiper-pagination-bullet-size': `${
          content.pagination_bullet_size || 8
        }px`,
        '& .swiper': {
          height: content.height ? `${content.height}px` : undefined,
          width: content.width ? `${content.width}px` : undefined
        }
      }}
    >
      <Container>
        {content.body?.map((blok) => {
          return (
            <SwiperSlide key={blok._uid}>
              <LmComponentRender
                key={blok._uid}
                content={blok}
                options={content}
              />
            </SwiperSlide>
          )
        })}
      </Container>
    </Box>
  )
}
