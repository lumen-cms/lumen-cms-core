import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'
import {
  Children,
  CSSProperties,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import CircleMedium from 'mdi-material-ui/CircleMedium'
import MinusThick from 'mdi-material-ui/MinusThick'
import CircleSmall from 'mdi-material-ui/CircleSmall'
import Minus from 'mdi-material-ui/Minus'

const DARK = 'rgba(0,0,0,0.8)'
const LIGHT = 'rgba(255,255,255,0.8)'

type LmNukaCarouselProps = PropsWithChildren<{
  slideIndex?: number
  slidesToShow?: number
  wrapAround?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  pauseOnHover?: boolean
  disableAnimation?: boolean
  adaptiveHeight?: boolean
  withoutControls?: boolean
  style?: CSSProperties
  beforeSlide?: (currentSlideIndex: number, endSlideIndex: number) => void
  afterSlide?: (endSlideIndex: number) => void
  hidePagination?: boolean
  paginationBelowContent?: boolean
  arrowsBesidePagination?: boolean
  hideArrows?: boolean
  darkArrows?: boolean
  darkPagination?: boolean // the property should render minus
  paginationCircle?: boolean
}>

const overlay = (alignItems: string, justifyContent: string) =>
  ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems,
    justifyContent,
    zIndex: 2,
    pointerEvents: 'none',
    '& > *': { pointerEvents: 'auto' }
  } as const)

type CarouselSlide = { key: string; content: ReactNode }

function getSlides(children: ReactNode): CarouselSlide[] {
  const occurrences = new Map<string, number>()
  return Children.toArray(children).map((content) => {
    // React preserves caller keys here. Dynamic element lists must supply
    // stable keys; primitive slides can use their value as identity.
    const identity = isValidElement(content)
      ? `element:${content.key}`
      : JSON.stringify([typeof content, content])
    const occurrence = occurrences.get(identity) || 0
    occurrences.set(identity, occurrence + 1)
    return { content, key: JSON.stringify([identity, occurrence]) }
  })
}

function CarouselControls({
  slides,
  swiper,
  loop,
  currentSlide,
  edges,
  hidePagination,
  paginationBelowContent,
  arrowsBesidePagination,
  hideArrows,
  darkArrows,
  darkPagination,
  paginationCircle
}: Pick<
  LmNukaCarouselProps,
  | 'hidePagination'
  | 'paginationBelowContent'
  | 'arrowsBesidePagination'
  | 'hideArrows'
  | 'darkArrows'
  | 'darkPagination'
  | 'paginationCircle'
> & {
  slides: CarouselSlide[]
  swiper: SwiperClass | undefined
  loop: boolean
  currentSlide: number
  edges: { isBeginning: boolean; isEnd: boolean }
}) {
  const goToSlide = (index: number) =>
    loop ? swiper?.slideToLoop(index) : swiper?.slideTo(index)

  const ActiveIndicator = paginationCircle ? <MinusThick /> : <CircleMedium />
  const DefaultIndicator = paginationCircle ? <Minus /> : <CircleSmall />
  const previousDisabled = !loop && edges.isBeginning
  const nextDisabled = !loop && edges.isEnd

  return (
    <>
      <Box sx={overlay('center', 'flex-start')}>
        {!hideArrows && (
          <IconButton
            size={'large'}
            onClick={() => swiper?.slidePrev()}
            disabled={previousDisabled}
            aria-label="previous slide"
            sx={{
              color: darkArrows ? DARK : LIGHT,
              fontSize: '4rem'
            }}
          >
            <ChevronLeft fontSize={'inherit'} />
          </IconButton>
        )}
      </Box>
      <Box sx={overlay('center', 'flex-end')}>
        {!hideArrows && (
          <IconButton
            size={'large'}
            onClick={() => swiper?.slideNext()}
            disabled={nextDisabled}
            aria-label="next slide"
            sx={{
              color: darkArrows ? DARK : LIGHT,
              fontSize: '4rem'
            }}
          >
            <ChevronRight fontSize={'inherit'} />
          </IconButton>
        )}
      </Box>
      <Box sx={overlay('flex-end', 'center')}>
        <Box
          sx={{
            display: hidePagination ? 'none' : undefined,
            marginBottom: paginationBelowContent ? '-64px' : undefined,
            color: darkPagination ? DARK : LIGHT
          }}
        >
          <IconButton
            sx={{
              display: arrowsBesidePagination ? 'inline-flex' : 'none'
            }}
            size="small"
            onClick={() => swiper?.slidePrev()}
            color={'inherit'}
          >
            <ChevronLeft color={'inherit'} />
          </IconButton>
          {slides.map((slide, i) => (
            <IconButton
              color="inherit"
              size="small"
              key={slide.key}
              aria-label={`slide ${i + 1}`}
              onClick={() => goToSlide(i)}
            >
              {currentSlide === i ? ActiveIndicator : DefaultIndicator}
            </IconButton>
          ))}
          <IconButton
            onClick={() => swiper?.slideNext()}
            color="inherit"
            size="small"
            sx={{
              display: arrowsBesidePagination ? 'inline-flex' : 'none'
            }}
          >
            <ChevronRight color={'inherit'} />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}

export default function LmNukaCarousel({
  children,
  slideIndex = 0,
  slidesToShow = 1,
  wrapAround = true,
  autoplay,
  autoplayInterval = 3000,
  pauseOnHover = true,
  disableAnimation,
  adaptiveHeight,
  withoutControls,
  style,
  beforeSlide,
  afterSlide,
  hidePagination,
  paginationBelowContent,
  arrowsBesidePagination,
  hideArrows,
  darkArrows,
  darkPagination,
  paginationCircle
}: LmNukaCarouselProps) {
  const slides = getSlides(children)
  const [swiper, setSwiper] = useState<SwiperClass>()
  const [currentSlide, setCurrentSlide] = useState(slideIndex)
  const [edges, setEdges] = useState({ isBeginning: true, isEnd: false })
  const previousSlide = useRef(slideIndex)
  const loop = wrapAround && slides.length > slidesToShow

  useEffect(() => {
    if (!swiper || swiper.destroyed || swiper.realIndex === slideIndex) {
      return
    }
    if (loop) {
      swiper.slideToLoop(slideIndex)
    } else {
      swiper.slideTo(slideIndex)
    }
  }, [swiper, slideIndex, loop])

  return (
    <Box
      className="lm-carousel"
      sx={{ position: 'relative', '& > .swiper': { height: '100%' } }}
      style={style}
    >
      <Swiper
        modules={[A11y, Autoplay]}
        slidesPerView={slidesToShow}
        initialSlide={slideIndex}
        loop={loop}
        speed={disableAnimation ? 0 : 500}
        autoHeight={adaptiveHeight}
        autoplay={
          autoplay
            ? {
                delay: autoplayInterval,
                pauseOnMouseEnter: pauseOnHover,
                disableOnInteraction: false
              }
            : false
        }
        onSwiper={(instance) => {
          setSwiper(instance)
          setEdges({ isBeginning: instance.isBeginning, isEnd: instance.isEnd })
        }}
        onRealIndexChange={(instance) => {
          beforeSlide?.(previousSlide.current, instance.realIndex)
          previousSlide.current = instance.realIndex
          setCurrentSlide(instance.realIndex)
          setEdges({ isBeginning: instance.isBeginning, isEnd: instance.isEnd })
        }}
        onSlideChangeTransitionEnd={(instance) =>
          afterSlide?.(instance.realIndex)
        }
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.key}
            // Nuka's slides reset inherited alignment. Keep that default for
            // tab panels inside centered columns; blocks can still override it.
            style={{ textAlign: 'left' }}
          >
            {slide.content}
          </SwiperSlide>
        ))}
      </Swiper>
      {!withoutControls && (
        <CarouselControls
          slides={slides}
          swiper={swiper}
          loop={loop}
          currentSlide={currentSlide}
          edges={edges}
          hidePagination={hidePagination}
          paginationBelowContent={paginationBelowContent}
          arrowsBesidePagination={arrowsBesidePagination}
          hideArrows={hideArrows}
          darkArrows={darkArrows}
          darkPagination={darkPagination}
          paginationCircle={paginationCircle}
        />
      )}
    </Box>
  )
}
