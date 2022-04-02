import { EffectCards } from 'swiper'
import 'swiper/css/effect-cards'
import { FC } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import Box from '@mui/material/Box'

const SwiperEffectCards: FC<{
  swiperProps: SwiperProps
}> = ({ children, swiperProps }) => {
  return (
    <Box
      sx={{
        '& .swiper': {
          width: '240px',
          height: '320px'
        },
        '& .swiper-slide': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '18px'
        }
      }}
    >
      <Swiper
        {...swiperProps}
        effect={'cards'}
        modules={[...(swiperProps.modules || []), EffectCards]}
      >
        {children}
      </Swiper>
    </Box>
  )
}
export default SwiperEffectCards
