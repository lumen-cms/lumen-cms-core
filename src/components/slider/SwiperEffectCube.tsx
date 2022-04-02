import { EffectCube } from 'swiper'
import 'swiper/css/effect-cube'
import { FC } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import Box from '@mui/material/Box'

const SwiperEffectCube: FC<{
  swiperProps: SwiperProps
}> = ({ children, swiperProps }) => {
  const height = 300
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        '& .swiper': {
          height: `${height}px`,
          width: `${height}px`,
          position: 'absolute',
          left: '50%',
          top: '0',
          marginX: `-${height / 2}px`
        },
        '& .swiper-slide': {
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          '& img': {
            width: '100%',
            display: 'block'
          }
        }
      }}
    >
      <Swiper
        {...swiperProps}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }}
        effect={'cube'}
        modules={[...(swiperProps.modules || []), EffectCube]}
      >
        {children}
      </Swiper>
    </Box>
  )
}
export default SwiperEffectCube
