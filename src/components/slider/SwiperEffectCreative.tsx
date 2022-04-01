import { EffectCreative } from 'swiper'
import 'swiper/css/effect-creative'
import { FC } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import Box from '@mui/material/Box'

const SwiperEffectCreative: FC<{
  swiperProps: SwiperProps
}> = ({ children, swiperProps }) => {
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
            translate: [0, 0, -400]
          },
          next: {
            translate: ['100%', 0, 0]
          }
        }}
        effect={'creative'}
        navigation={false}
        grabCursor={true}
        modules={[...(swiperProps.modules || []), EffectCreative]}
      >
        {children}
      </Swiper>
    </Box>
  )
}
export default SwiperEffectCreative
