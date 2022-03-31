import { useSwiper } from 'swiper/react'

export default function LmSwiperPagination() {
  const swiper = useSwiper()

  return <div>the start of pagination {swiper.activeIndex}</div>
}
