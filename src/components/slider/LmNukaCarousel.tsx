import Carousel from 'nuka-carousel'
import { LmSliderProps } from './sliderTypes'
import { LmComponentRender } from '@LmComponentRender'

export default function LmNukaCarousel({ content }: LmSliderProps) {
  return (
    <Carousel
      animation={'zoom'}
      easing={'easeElasticInOut'}
      autoplayInterval={2000}
    >
      {content.body?.map((blok) => (
        <div key={blok._uid}>
          <LmComponentRender content={blok} />
        </div>
      ))}
    </Carousel>
  )
}
