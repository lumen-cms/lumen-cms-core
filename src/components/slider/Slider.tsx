import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import { CSSProperties, useState } from 'react'
import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import CircleMedium from 'mdi-material-ui/CircleMedium'
import CircleSmall from 'mdi-material-ui/CircleSmall'
import Minus from 'mdi-material-ui/Minus'
import MinusThick from 'mdi-material-ui/MinusThick'
import { LmComponentRender } from '@LmComponentRender'
import IconButton from '@mui/material/IconButton'
import { LmSliderChild } from './SliderChild'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import { SectionProps } from '../section/sectionTypes'
import { LmSliderProps } from './sliderTypes'
import { visuallyHidden } from '@mui/utils'

const chunkArray = (myArray: any, chunkSize: number) => {
  const results = []
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize))
  }
  return results
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

export const useStyles = makeStyles({
  carousel: {
    position: 'relative',
    '& [data-swipeable="true"]': {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      '& > div': {
        overflow: 'hidden',
        height: '100%',
        width: '100%'
      }
    },
    '&.carousel__container-align-center .react-swipeable-view-container': {
      alignItems: 'center'
    },
    '& .react-swipeable-view-container .MuiContainer-root': {
      padding: '0px !important',
      margin: '0px !important',
      maxWidth: 'inherit !important'
    },

    '&.carousel__arrows_dark': {
      '& .MuiSvgIcon-root': {
        color: 'rgba(0,0,0,0.8)'
      }
    },
    '& .carousel-control-next, & .carousel-control-prev': {
      position: 'absolute',
      height: '100%',
      top: 0,
      display: 'flex',
      borderRadius: 0,
      alignItems: 'center',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: '4rem',
        color: 'rgba(255,255,255,0.8)'
      }
    },
    '& .carousel-control-next': {
      right: 0
    }
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)'
  },
  darkColor: {
    color: 'rgba(0,0,0,0.8)'
  },
  carouselIndicatorBelow: {
    position: 'relative',
    padding: '8px 0'
  }
})

export default function LmSlider({ content }: LmSliderProps): JSX.Element {
  const [slide, setSlide] = useState(0)
  const autoSlide = !!content.autoslide
  const [start, setStart] = useState<boolean>(true)
  const { isMobile } = useDeviceDimensions()
  const classes = useStyles()
  const wrapInColumns = content.slides_per_view && !isMobile
  const contentBody: LmSliderProps['content']['body'] = content.body || []
  const body = wrapInColumns
    ? chunkArray(contentBody.slice(0), content.slides_per_view as number)
    : contentBody
  const properties = content.property || []
  const styles: CSSProperties = {}

  function handleChangeIndex(i: number) {
    setSlide(i)
  }

  if (content.background_color) {
    styles.backgroundColor =
      content.background_color && content.background_color.rgba
  }

  const ActiveIndicator = () =>
    !properties.includes('pagination_circle') ? (
      <CircleMedium />
    ) : (
      <MinusThick />
    )
  const DefaultIndicator = () =>
    !properties.includes('pagination_circle') ? <CircleSmall /> : <Minus />

  const onPrevClick = () => setSlide(slide === 0 ? body.length - 1 : slide - 1)
  const onNextClick = () => setSlide(slide === body.length - 1 ? 0 : slide + 1)
  return (
    <div
      className={clsx(
        classes.carousel,
        'carousel slide',
        properties.map((i) => `carousel__${i}`)
      )}
      style={styles}
      onMouseEnter={() => {
        if (content.pause_on_hover && content.autoslide) {
          setStart(false)
        }
      }}
      onMouseLeave={() => {
        if (content.pause_on_hover && content.autoslide) {
          setStart(true)
        }
      }}
    >
      <AutoPlaySwipeableViews
        index={slide}
        animateTransitions={!content.disable_transition}
        autoplay={autoSlide}
        interval={autoSlide ? Number(content.autoslide) : undefined}
        onChangeIndex={(i: any) =>
          autoSlide ? start && setSlide(i) : setSlide(i)
        }
        springConfig={{
          duration: content.autoslide_duration
            ? `${content.autoslide_duration}ms`
            : '0.5s',
          easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
          delay: '0s'
        }}
      >
        {wrapInColumns
          ? body.map((child, index) => {
              return (
                <LmSliderChild
                  key={String(`swipeable_${index}`)}
                  body={child}
                  sectionVariant={content.section_variant}
                />
              )
            })
          : body.map((item) => {
              if (item.component === 'section') {
                const newOpts: SectionProps = {
                  ...item,
                  presetVariant: content.section_variant || 'transparent'
                }
                return (
                  <LmComponentRender content={newOpts} key={newOpts._uid} />
                )
              }
              return <LmComponentRender content={item} key={item._uid} />
            })}
      </AutoPlaySwipeableViews>
      {!['hide_arrows', 'arrows_beside_pagination'].some((i) =>
        properties.includes(i as any)
      ) && (
        <IconButton
          className="carousel-control-prev"
          onClick={onPrevClick}
          size="large"
        >
          <ChevronLeft />
          <Typography sx={visuallyHidden}>Previous</Typography>
        </IconButton>
      )}

      {!['hide_arrows', 'arrows_beside_pagination'].some((i) =>
        properties.includes(i as any)
      ) && (
        <IconButton
          className="carousel-control-next"
          role="button"
          onClick={onNextClick}
          size="large"
        >
          <ChevronRight />
          <Typography sx={visuallyHidden}>Next</Typography>
        </IconButton>
      )}
      <div
        className={clsx(classes.carouselIndicators, {
          [classes.carouselIndicatorBelow]: properties.includes(
            'pagination_below_content'
          ),
          [classes.darkColor]: properties.includes('pagination_dark'),
          'd-none': properties.includes('hide_pagination')
        })}
        style={{
          backgroundColor:
            content.indicator_background_color?.rgba || undefined,
          textAlign: properties.includes('pagination_bottom_right')
            ? 'right'
            : undefined
        }}
      >
        <IconButton
          className={clsx({
            'd-none': !properties.includes('arrows_beside_pagination')
          })}
          size="small"
          onClick={onPrevClick}
          color="inherit"
        >
          <ChevronLeft />
        </IconButton>
        {body.map((item, i) => {
          return (
            <IconButton
              color="inherit"
              size="small"
              key={item._uid || `pagination_${i}`}
              onClick={() => handleChangeIndex(i)}
            >
              {slide === i ? <ActiveIndicator /> : <DefaultIndicator />}
            </IconButton>
          )
        })}
        <IconButton
          onClick={onNextClick}
          color="inherit"
          size="small"
          className={clsx({
            'd-none': !properties.includes('arrows_beside_pagination')
          })}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  )
}
