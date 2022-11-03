import Carousel, { CarouselProps } from 'nuka-carousel'
import React, { PropsWithChildren } from 'react'
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

type LmNukaCarouselProps = PropsWithChildren<
  CarouselProps & {
    hidePagination?: boolean
    paginationBelowContent?: boolean
    arrowsBesidePagination?: boolean
    hideArrows?: boolean
    darkArrows?: boolean
    darkPagination?: boolean
    paginationCircle?: boolean
  }
>

export default function LmNukaCarousel({
  hidePagination,
  paginationBelowContent,
  arrowsBesidePagination,
  hideArrows,
  darkArrows,
  darkPagination,
  paginationCircle,
  ...carouselProps
}: LmNukaCarouselProps) {
  const ActiveIndicator = paginationCircle ? <CircleMedium /> : <MinusThick />
  const DefaultIndicator = paginationCircle ? <CircleSmall /> : <Minus />
  return (
    <Carousel
      wrapAround={true}
      {...carouselProps}
      renderBottomCenterControls={({
        pagingDotsIndices,
        goToSlide,
        currentSlide,
        previousSlide,
        nextSlide
      }) => {
        return (
          <Box
            display={hidePagination ? 'none' : undefined}
            marginBottom={paginationBelowContent ? '-64px' : undefined}
            color={darkPagination ? DARK : LIGHT}
          >
            <IconButton
              sx={{
                display: arrowsBesidePagination ? 'inline-flex' : 'none'
              }}
              size="small"
              onClick={() => previousSlide()}
              color={'inherit'}
            >
              <ChevronLeft color={'inherit'} />
            </IconButton>
            {pagingDotsIndices.map((i) => (
              <IconButton
                color="inherit"
                size="small"
                key={`pagination_${i}`}
                onClick={() => goToSlide(i)}
              >
                {currentSlide === i ? ActiveIndicator : DefaultIndicator}
              </IconButton>
            ))}
            <IconButton
              onClick={() => nextSlide()}
              color="inherit"
              size="small"
              sx={{
                display: arrowsBesidePagination ? 'inline-flex' : 'none'
              }}
            >
              <ChevronRight color={'inherit'} />
            </IconButton>
          </Box>
        )
      }}
      renderCenterLeftControls={({ previousDisabled, previousSlide }) =>
        !hideArrows ? (
          <IconButton
            size={'large'}
            onClick={previousSlide}
            disabled={previousDisabled}
            sx={{
              color: darkArrows ? DARK : LIGHT,
              fontSize: '4rem'
            }}
          >
            <ChevronLeft fontSize={'inherit'} />
          </IconButton>
        ) : null
      }
      renderCenterRightControls={({ nextDisabled, nextSlide }) =>
        !hideArrows ? (
          <IconButton
            size={'large'}
            onClick={nextSlide}
            disabled={nextDisabled}
            sx={{
              color: darkArrows ? DARK : LIGHT,
              fontSize: '4rem'
            }}
          >
            <ChevronRight fontSize={'inherit'} />
          </IconButton>
        ) : null
      }
    />
  )
}
