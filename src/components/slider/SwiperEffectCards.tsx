import { EffectCards } from 'swiper/modules'
import 'swiper/css/effect-cards'
import { FC, PropsWithChildren } from 'react'
import { Swiper, SwiperProps } from 'swiper/react'
import Box from '@mui/material/Box'

const SwiperEffectCards: FC<
  PropsWithChildren<{
    swiperProps: SwiperProps
  }>
> = ({ children, swiperProps }) => {
  return (
    <Box
      sx={{
        '& .swiper': {
          width: '240px',
          height: '320px'
        },
        '& .swiper-slide': {
          // v14 clips card contents by default; retain the CMS's visible edges.
          overflow: 'visible',
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
