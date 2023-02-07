import { SwiperProps, SwiperSlide } from 'swiper/react'
import { LmSwiperProps } from './sliderTypes'
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { LmComponentRender } from '@LmComponentRender'
import { PaginationOptions } from 'swiper/types'
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import LmSwiperContainer from './LmSwiperContainer'

export default function LmSwiper({ content }: LmSwiperProps) {
  const { property } = content
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
      <LmSwiperContainer swiperProps={swiperProps} effect={content.effect}>
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
      </LmSwiperContainer>
    </Box>
  )
}
