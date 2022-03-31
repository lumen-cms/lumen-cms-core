import { EffectCoverflow } from 'swiper'
import 'swiper/css/effect-coverflow'
import { FC } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import Box from '@mui/material/Box'

const SwiperEffectCoverflow: FC<{
  swiperProps: SwiperProps
}> = ({ children, swiperProps }) => {
  return (
    <Box
      sx={{
        '& .swiper': {
          width: '100%',
          paddingY: '50px'
        },
        '& .swiper-slide': {
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '300px!important',
          height: '300px'
        }
      }}
    >
      <Swiper
        {...swiperProps}
        effect={'coverflow'}
        centeredSlides={true}
        grabCursor={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }}
        modules={[...(swiperProps.modules || []), EffectCoverflow]}
      >
        {children}
      </Swiper>
    </Box>
  )
}
export default SwiperEffectCoverflow
