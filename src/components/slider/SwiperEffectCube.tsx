import { EffectCube } from 'swiper'
import 'swiper/css/effect-cube'
import { FC } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import Box from '@mui/material/Box'

const SwiperEffectCube: FC<{
  swiperProps: SwiperProps
}> = ({ children, swiperProps }) => {
  return (
    <Box
      sx={{
        '& .swiper': {
          width: '300px',
          height: '300px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginX: '-150px'
        },
        '& .swiper-slide': {
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }
      }}
    >
      <Swiper
        {...swiperProps}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }}
        effect={'cube'}
        navigation={false}
        modules={[...(swiperProps.modules || []), EffectCube]}
      >
        {children}
      </Swiper>
    </Box>
  )
}
export default SwiperEffectCube
