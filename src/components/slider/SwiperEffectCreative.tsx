import { EffectCreative } from 'swiper/modules'
import 'swiper/css/effect-creative'
import { FC, PropsWithChildren } from 'react'
import type { SwiperProps } from 'swiper/react'
import { DeferredSwiper as Swiper } from './DeferredSwiper'
import Box from '@mui/material/Box'

const SwiperEffectCreative: FC<
  PropsWithChildren<{
    swiperProps: SwiperProps
  }>
> = ({ children, swiperProps }) => {
  return (
    <Box
      sx={{
        '& .swiper': {
          margin: '0 auto'
        },
        '& .swiper-slide': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <Swiper
        {...swiperProps}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-120%', 0, -500]
          },
          next: {
            shadow: true,
            translate: ['120%', 0, -500]
          }
        }}
        effect={'creative'}
        modules={[...(swiperProps.modules || []), EffectCreative]}
      >
        {children}
      </Swiper>
    </Box>
  )
}
export default SwiperEffectCreative
