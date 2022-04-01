import { useSwiper } from 'swiper/react'
import { Button } from '@mui/material'
import { LmSliderProps } from './sliderTypes'

type LmSwiperPaginationProps = {
  activeIndex?: number
  items: LmSliderProps['content']['body']
  property: LmSliderProps['content']['property']
}
export default function LmSwiperPagination({
  activeIndex,
  items = [],
  property
}: LmSwiperPaginationProps) {
  const swiper = useSwiper()
  console.log(property, swiper)
  return (
    <div>
      the start of pagination {activeIndex}
      {items.map((block, index) => {
        return (
          <Button
            key={block._uid}
            onClick={() => {
              swiper.slideTo(index)
            }}
          >
            {index}
          </Button>
        )
      })}
    </div>
  )
}
